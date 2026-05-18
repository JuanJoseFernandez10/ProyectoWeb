package com.groovelink.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    private String sender;
    private String content;
    private Long roomId;
    private String recipient;
    private MessageType type;

    public ChatMessage() {
        this.type = MessageType.CHAT;
    }
}
