package com.ecom.project.config;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AnthropicConfig {

    // Resolved from (in order): an OS-exported ANTHROPIC_API_KEY, or the
    // gitignored backend/.env.properties file auto-loaded via
    // spring.config.import in application.properties.
    // Empty default keeps the app startable with no key configured (e.g. AI
    // features not needed yet); the chat call itself fails clearly instead.
    @Value("${ANTHROPIC_API_KEY:}")
    private String anthropicApiKey;

    @Bean
    public AnthropicClient anthropicClient() {
        return AnthropicOkHttpClient.builder()
                .apiKey(anthropicApiKey)
                .build();
    }
}
