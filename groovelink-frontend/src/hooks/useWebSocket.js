import { useCallback, useEffect, useRef } from 'react'
import { API_URL } from '../api/config'
import { getAuthToken } from '../api/authSession'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

let stompClient = null
let connectionListeners = []
let subscriptions = {}

function notifyListeners() {
    const connected = stompClient && stompClient.connected
    connectionListeners.forEach((fn) => fn(connected))
}

export function connectWebSocket() {
    if (stompClient && stompClient.connected) {
        return
    }

    const token = getAuthToken()
    if (!token) {
        return
    }

    if (stompClient) {
        stompClient.deactivate()
        stompClient = null
    }

    stompClient = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/ws`),
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: () => {
            notifyListeners()
            Object.entries(subscriptions).forEach(([key, sub]) => {
                if (!sub.active) {
                    const s = stompClient.subscribe(sub.destination, sub.callback)
                    subscriptions[key] = { ...sub, stompSub: s, active: true }
                }
            })
        },
        onStompError: () => {
            notifyListeners()
        },
        onWebSocketClose: () => {
            notifyListeners()
        },
    })

    stompClient.activate()
}

export function disconnectWebSocket() {
    if (stompClient) {
        stompClient.deactivate()
        stompClient = null
    }
    subscriptions = {}
    notifyListeners()
}

export function subscribeToRoom(roomId, callback) {
    const destination = `/topic/room/${roomId}`
    if (subscriptions[destination]) {
        return () => unsubscribeFromRoom(roomId)
    }

    let stompSub = null
    if (stompClient && stompClient.connected) {
        stompSub = stompClient.subscribe(destination, callback)
    }

    subscriptions[destination] = {
        destination,
        callback,
        stompSub,
        active: Boolean(stompSub),
        roomId,
    }

    return () => unsubscribeFromRoom(roomId)
}

export function unsubscribeFromRoom(roomId) {
    const destination = `/topic/room/${roomId}`
    const sub = subscriptions[destination]
    if (sub) {
        if (sub.stompSub) {
            sub.stompSub.unsubscribe()
        }
        delete subscriptions[destination]
    }
}

export function sendWebSocketMessage(destination, body) {
    if (!stompClient || !stompClient.connected) {
        return
    }

    stompClient.publish({ destination, body: JSON.stringify(body) })
}

export function useWebSocket() {
    const connectedRef = useRef(false)
    const listenersRef = useRef([])

    const addListener = useCallback((fn) => {
        listenersRef.current.push(fn)
        if (stompClient) {
            fn(stompClient.connected)
        }

        return () => {
            listenersRef.current = listenersRef.current.filter((l) => l !== fn)
        }
    }, [])

    useEffect(() => {
        const handler = () => {
            const connected = stompClient && stompClient.connected
            connectedRef.current = connected
            listenersRef.current.forEach((fn) => fn(connected))
        }

        connectionListeners.push(handler)

        return () => {
            connectionListeners = connectionListeners.filter((h) => h !== handler)
        }
    }, [])

    return {
        isConnected: connectedRef.current,
        onConnectionChange: addListener,
        connect: connectWebSocket,
        disconnect: disconnectWebSocket,
        subscribe: subscribeToRoom,
        unsubscribe: unsubscribeFromRoom,
        send: sendWebSocketMessage,
    }
}
