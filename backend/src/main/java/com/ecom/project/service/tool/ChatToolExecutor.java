package com.ecom.project.service.tool;

import com.ecom.project.exception.ResourceNotFoundException;
import com.ecom.project.model.Cart;
import com.ecom.project.payload.CartDTO;
import com.ecom.project.payload.ProductDTO;
import com.ecom.project.payload.ProductResponseDTO;
import com.ecom.project.repo.CartRepository;
import com.ecom.project.service.CartService;
import com.ecom.project.service.ProductService;
import com.ecom.project.util.AuthUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Executes tool calls Claude requests, by delegating to the app's real
 * service layer. Never throws — every path returns a compact JSON string
 * so the chat loop can hand results straight back to Claude.
 */
@Component
public class ChatToolExecutor {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Autowired
    private ProductService productService;

    @Autowired
    private CartService cartService;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private AuthUtil authUtil;

    /** Result of running one tool: the content to send back, and whether it's an error. */
    public record ToolResult(String content, boolean isError) {
    }

    public ToolResult execute(String toolName, JsonNode input) {
        try {
            String result = switch (toolName) {
                case "search_products" -> searchProducts(input.get("keyword").asText());
                case "get_product_details" -> getProductDetails(input.get("productId").asLong());
                case "add_to_cart" -> addToCart(
                        input.get("productId").asLong(),
                        input.has("quantity") ? input.get("quantity").asInt() : 1);
                case "view_cart" -> viewCart();
                default -> null;
            };
            if (result == null) {
                return new ToolResult("Unknown tool: " + toolName, true);
            }
            return new ToolResult(result, false);
        } catch (ResourceNotFoundException e) {
            return new ToolResult(e.getMessage(), true);
        } catch (Exception e) {
            return new ToolResult("Something went wrong while running " + toolName + ": " + e.getMessage(), true);
        }
    }

    private String searchProducts(String keyword) {
        ProductResponseDTO response = productService.getProductsByKeyword(keyword, 0, 10, "productId", "asc");
        List<Map<String, Object>> summaries = response.getProductList().stream()
                .map(this::summarize)
                .collect(Collectors.toList());
        return toJson(Map.of("results", summaries, "count", summaries.size()));
    }

    private String getProductDetails(Long productId) {
        ProductDTO product = productService.getProductById(productId);
        return toJson(summarizeDetailed(product));
    }

    private String addToCart(Long productId, Integer quantity) {
        CartDTO cart = cartService.addProductToCart(productId, quantity);
        return toJson(Map.of(
                "message", "Added to cart.",
                "cartTotal", cart.getTotalPrice(),
                "itemCount", cart.getProducts().size()));
    }

    private String viewCart() {
        String emailId = authUtil.loggedInEmail();
        Cart cart = cartRepository.findCartByEmail(emailId);
        if (cart == null) {
            return toJson(Map.of("items", List.of(), "totalPrice", 0.0));
        }
        CartDTO cartDTO = cartService.getCart(emailId, cart.getCartId());
        List<Map<String, Object>> items = cartDTO.getProducts().stream()
                .map(this::summarize)
                .collect(Collectors.toList());
        return toJson(Map.of("items", items, "totalPrice", cartDTO.getTotalPrice()));
    }

    private Map<String, Object> summarize(ProductDTO p) {
        return Map.of(
                "productId", p.getProductId(),
                "name", p.getProductName(),
                "price", p.getSpecialPrice(),
                "quantity", p.getQuantity());
    }

    private Map<String, Object> summarizeDetailed(ProductDTO p) {
        return Map.of(
                "productId", p.getProductId(),
                "name", p.getProductName(),
                "description", p.getDescription(),
                "price", p.getSpecialPrice(),
                "quantity", p.getQuantity());
    }

    private String toJson(Object value) {
        try {
            return MAPPER.writeValueAsString(value);
        } catch (Exception e) {
            return "{}";
        }
    }
}
