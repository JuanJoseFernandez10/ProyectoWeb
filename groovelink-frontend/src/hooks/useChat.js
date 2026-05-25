import { useState, useEffect, useCallback, useRef, useContext } from 'react'
import { fetchMyChats, fetchChatMessages } from '../api/chat'
import { AuthContext } from '../context/AuthContext'
import {
    connectWebSocket,
    disconnectWebSocket,
    subscribeToRoom,
    sendWebSocketMessage,
    useWebSocket,
} from './useWebSocket'

export function useChat() {
    const [chats, setChats] = useState([])
    const [activeChat, setActiveChat] = useState(null)
    const [messages, setMessages] = useState({})
    const [loading, setLoading] = useState(true)
    const [wsConnected, setWsConnected] = useState(false)
    const subscriptionsRef = useRef([])

    const { onConnectionChange } = useWebSocket()

    useEffect(() => {
        const unsub = onConnectionChange(setWsConnected)
        return () => unsub()
    }, [onConnectionChange])

    const { token } = useContext(AuthContext)

    useEffect(() => {
        if (!token) {
            setChats([])
            setMessages({})
            setActiveChat(null)
            setLoading(false)
            disconnectWebSocket()
            return
        }

        setLoading(true)
        connectWebSocket()

        fetchMyChats()
            .then((data) => {
                setChats(data || [])
            })
            .catch(() => {
                setChats([])
            })
            .finally(() => {
                setLoading(false)
            })

        return () => {
            subscriptionsRef.current.forEach((unsub) => unsub())
            subscriptionsRef.current = []
        }
    }, [token])

    const openChat = useCallback((chatId) => {
        setActiveChat(chatId)

        if (!messages[chatId]) {
            setMessages((prev) => ({ ...prev, [chatId]: [] }))
        }

        fetchChatMessages(chatId)
            .then((data) => {
                setMessages((prev) => ({ ...prev, [chatId]: data?.content || data || [] }))
            })
            .catch(() => {
                setMessages((prev) => ({ ...prev, [chatId]: [] }))
            })

        const unsub = subscribeToRoom(chatId, (message) => {
            try {
                const parsed = JSON.parse(message.body)
                setMessages((prev) => ({
                    ...prev,
                    [chatId]: [...(prev[chatId] || []), parsed],
                }))
            } catch {
            }
        })

        subscriptionsRef.current.push(unsub)
    }, [messages])

    const closeChat = useCallback(() => {
        setActiveChat(null)
    }, [])

    const sendMessage = useCallback((chatId, content) => {
        if (!content.trim()) {
            return
        }

        let username = 'unknown'
        try {
            const raw = localStorage.getItem('groovelink_auth')
            if (raw) {
                const parsed = JSON.parse(raw)
                username = parsed?.user?.username || 'unknown'
            }
        } catch {
        }

        const payload = {
            content: content.trim(),
            roomId: chatId,
            sender: username,
            type: 'CHAT',
        }

        sendWebSocketMessage('/app/chat.send', payload)
    }, [])

    const sendPrivateMessage = useCallback((chatId, content, recipient) => {
        if (!content.trim()) {
            return
        }

        const payload = {
            content: content.trim(),
            roomId: chatId,
            recipient,
            type: 'CHAT',
        }

        sendWebSocketMessage('/app/chat.private', payload)
    }, [])

    const getActiveChatName = useCallback(() => {
        if (!activeChat) {
            return ''
        }

        const chat = chats.find((c) => c.id === activeChat)
        if (!chat) {
            return ''
        }

        if (!chat.esGrupal && chat.participantesUsernames) {
            const currentUsername = (() => {
                try {
                    const raw = localStorage.getItem('groovelink_auth')
                    if (raw) {
                        return JSON.parse(raw)?.user?.username || null
                    }
                } catch {
                }
                return null
            })()
            const other = chat.participantesUsernames.find((u) => u !== currentUsername)
            if (other) {
                return other
            }
        }

        return chat.nombre || ''
    }, [activeChat, chats])

    const getActiveChatParticipants = useCallback(() => {
        if (!activeChat) {
            return []
        }

        const chat = chats.find((c) => c.id === activeChat)
        return chat?.participantesUsernames || []
    }, [activeChat, chats])

    const getActiveChatParticipantIds = useCallback(() => {
        if (!activeChat) {
            return {}
        }

        const chat = chats.find((c) => c.id === activeChat)
        return chat?.participantesIds || {}
    }, [activeChat, chats])

    const getActiveChat = useCallback(() => {
        if (!activeChat) return null
        return chats.find((c) => c.id === activeChat) || null
    }, [activeChat, chats])

    const getActiveChatImage = useCallback(() => {
        if (!activeChat) {
            return null
        }

        const chat = chats.find((c) => c.id === activeChat)
        if (!chat) {
            return null
        }

        if (chat.esGrupal && chat.imagen) {
            return chat.imagen
        }

        if (!chat.esGrupal && chat.participantesFotos && chat.participantesUsernames) {
            const currentUsername = (() => {
                try {
                    const raw = localStorage.getItem('groovelink_auth')
                    if (raw) {
                        return JSON.parse(raw)?.user?.username || null
                    }
                } catch {
                }
                return null
            })()
            const other = chat.participantesUsernames.find((u) => u !== currentUsername)
            if (other && chat.participantesFotos[other]) {
                return chat.participantesFotos[other]
            }
        }

        return null
    }, [activeChat, chats])

    return {
        chats,
        activeChat,
        messages,
        loading,
        wsConnected,
        openChat,
        closeChat,
        sendMessage,
        sendPrivateMessage,
        getActiveChat,
        getActiveChatName,
        getActiveChatParticipants,
        getActiveChatParticipantIds,
        getActiveChatImage,
    }
}
