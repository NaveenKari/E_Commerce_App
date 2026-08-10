package com.ecom.project.service;

import com.ecom.project.payload.ChatRequest;
import com.ecom.project.payload.ChatResponse;

public interface ChatService {
    ChatResponse sendMessage(ChatRequest request);
}
