package com.ecom.project.controller;

import com.ecom.project.payload.ChatRequest;
import com.ecom.project.payload.ChatResponse;
import com.ecom.project.service.ChatRateLimiter;
import com.ecom.project.service.ChatService;
import com.ecom.project.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private ChatRateLimiter rateLimiter;

    @Autowired
    private AuthUtil authUtil;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest chatRequest) {
        if (!rateLimiter.tryAcquire(authUtil.loggedInEmail())) {
            return new ResponseEntity<>(
                    new ChatResponse("You're sending messages too quickly. Please wait a moment and try again."),
                    HttpStatus.TOO_MANY_REQUESTS);
        }
        ChatResponse response = chatService.sendMessage(chatRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
