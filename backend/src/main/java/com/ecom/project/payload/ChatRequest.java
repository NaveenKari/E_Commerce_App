package com.ecom.project.payload;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {

    @Valid
    @NotEmpty
    @Size(max = 20, message = "conversation history is limited to 20 messages")
    private List<ChatMessageDTO> messages;
}
