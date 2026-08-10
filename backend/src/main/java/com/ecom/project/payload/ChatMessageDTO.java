package com.ecom.project.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {

    @NotBlank
    @Pattern(regexp = "user|assistant", message = "role must be 'user' or 'assistant'")
    private String role;

    @NotBlank
    @Size(max = 2000, message = "message content must be 2000 characters or fewer")
    private String content;
}
