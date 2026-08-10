package com.ecom.project.service;

import com.anthropic.client.AnthropicClient;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.StopReason;
import com.anthropic.models.messages.TextBlock;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlock;
import com.ecom.project.payload.ChatMessageDTO;
import com.ecom.project.payload.ChatRequest;
import com.ecom.project.payload.ChatResponse;
import com.ecom.project.service.tool.ChatToolDefinitions;
import com.ecom.project.service.tool.ChatToolExecutor;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private static final int MAX_TOOL_ITERATIONS = 6;

    private static final String SYSTEM_PROMPT = """
            You are a friendly shopping assistant for this store.
            Help users find products, check details, and add items to their cart.
            Only use the tools you're given; never invent product data or prices.
            Keep replies concise and conversational.
            """;

    @Autowired
    private AnthropicClient anthropicClient;

    @Autowired
    private ChatToolExecutor toolExecutor;

    @Value("${anthropic.model}")
    private String model;

    @Value("${anthropic.max-tokens}")
    private long maxTokens;

    @Override
    public ChatResponse sendMessage(ChatRequest request) {
        List<MessageParam> messages = toAnthropicMessages(request.getMessages());

        Message response = null;
        for (int i = 0; i < MAX_TOOL_ITERATIONS; i++) {
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(model)
                    .maxTokens(maxTokens)
                    .system(SYSTEM_PROMPT)
                    .tools(ChatToolDefinitions.CHAT_TOOLS)
                    .messages(messages)
                    .build();

            response = anthropicClient.messages().create(params);

            // Echo the full assistant turn (including tool_use blocks) back into
            // history BEFORE processing tool calls.
            messages.add(response.toParam());

            boolean isToolUse = response.stopReason()
                    .map(reason -> reason.equals(StopReason.TOOL_USE))
                    .orElse(false);
            if (!isToolUse) {
                break;
            }

            List<ContentBlockParam> toolResults = new ArrayList<>();
            for (var block : response.content()) {
                block.toolUse().ifPresent(toolUse -> toolResults.add(buildToolResult(toolUse)));
            }
            messages.add(MessageParam.builder()
                    .role(MessageParam.Role.USER)
                    .contentOfBlockParams(toolResults)
                    .build());
        }

        String replyText = response == null
                ? "Sorry, I couldn't process that."
                : response.content().stream()
                        .flatMap(b -> b.text().stream())
                        .map(TextBlock::text)
                        .collect(Collectors.joining("\n"));

        return new ChatResponse(replyText);
    }

    private ContentBlockParam buildToolResult(ToolUseBlock toolUse) {
        JsonNode input = toolUse._input().convert(JsonNode.class);
        ChatToolExecutor.ToolResult result = toolExecutor.execute(toolUse.name(), input);

        return ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                .toolUseId(toolUse.id())
                .content(result.content())
                .isError(result.isError())
                .build());
    }

    private List<MessageParam> toAnthropicMessages(List<ChatMessageDTO> history) {
        List<MessageParam> messages = new ArrayList<>();
        if (history == null) {
            return messages;
        }
        for (ChatMessageDTO m : history) {
            MessageParam.Role role = "assistant".equalsIgnoreCase(m.getRole())
                    ? MessageParam.Role.ASSISTANT
                    : MessageParam.Role.USER;
            messages.add(MessageParam.builder()
                    .role(role)
                    .content(m.getContent())
                    .build());
        }
        return messages;
    }
}
