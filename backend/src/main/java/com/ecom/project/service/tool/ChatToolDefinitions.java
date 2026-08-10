package com.ecom.project.service.tool;

import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.ToolUnion;

import java.util.List;
import java.util.Map;

/**
 * Static tool schemas exposed to Claude. Each tool maps 1:1 to an existing
 * service method invoked by {@link ChatToolExecutor}.
 */
public final class ChatToolDefinitions {

    private ChatToolDefinitions() {
    }

    public static final List<ToolUnion> CHAT_TOOLS = List.of(
            ToolUnion.ofTool(Tool.builder()
                    .name("search_products")
                    .description("Search the product catalog by keyword. Call this when the user asks "
                            + "to find, browse, or look for products by name, type, or description.")
                    .inputSchema(Tool.InputSchema.builder()
                            .properties(Tool.InputSchema.Properties.builder()
                                    .putAdditionalProperty("keyword", JsonValue.from(Map.of(
                                            "type", "string",
                                            "description", "The search keyword, e.g. 'running shoes'")))
                                    .build())
                            .required(List.of("keyword"))
                            .build())
                    .build()),

            ToolUnion.ofTool(Tool.builder()
                    .name("get_product_details")
                    .description("Get full details for a single product by its ID. Call this when the "
                            + "user asks for more information about a specific product they've already "
                            + "seen (e.g. from a search result).")
                    .inputSchema(Tool.InputSchema.builder()
                            .properties(Tool.InputSchema.Properties.builder()
                                    .putAdditionalProperty("productId", JsonValue.from(Map.of(
                                            "type", "integer",
                                            "description", "The numeric ID of the product")))
                                    .build())
                            .required(List.of("productId"))
                            .build())
                    .build()),

            ToolUnion.ofTool(Tool.builder()
                    .name("add_to_cart")
                    .description("Add a product to the logged-in user's cart. Call this when the user "
                            + "asks to add, buy, or put an item in their cart.")
                    .inputSchema(Tool.InputSchema.builder()
                            .properties(Tool.InputSchema.Properties.builder()
                                    .putAdditionalProperty("productId", JsonValue.from(Map.of(
                                            "type", "integer",
                                            "description", "The numeric ID of the product to add")))
                                    .putAdditionalProperty("quantity", JsonValue.from(Map.of(
                                            "type", "integer",
                                            "description", "How many units to add. Defaults to 1 if omitted.")))
                                    .build())
                            .required(List.of("productId"))
                            .build())
                    .build()),

            ToolUnion.ofTool(Tool.builder()
                    .name("view_cart")
                    .description("View the current contents of the logged-in user's cart. Call this "
                            + "when the user asks what's in their cart or wants a cart summary.")
                    .inputSchema(Tool.InputSchema.builder()
                            .properties(Tool.InputSchema.Properties.builder().build())
                            .build())
                    .build())
    );
}
