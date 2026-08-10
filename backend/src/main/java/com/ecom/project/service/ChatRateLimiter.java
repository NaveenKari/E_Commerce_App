package com.ecom.project.service;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory sliding-window rate limiter, keyed per user, guarding the
 * chat endpoint from being hammered (each request can trigger several paid
 * Anthropic API calls). Single-instance only — fine for this app's scale;
 * swap for a shared store (e.g. Redis) if the backend is ever run behind
 * multiple instances.
 */
@Component
public class ChatRateLimiter {

    private static final int MAX_REQUESTS = 15;
    private static final Duration WINDOW = Duration.ofMinutes(5);

    private final Map<String, Deque<Instant>> requestLog = new ConcurrentHashMap<>();

    /** Returns true if the request is allowed, false if the caller is over the limit. */
    public boolean tryAcquire(String key) {
        Instant now = Instant.now();
        Deque<Instant> timestamps = requestLog.computeIfAbsent(key, k -> new ArrayDeque<>());

        synchronized (timestamps) {
            while (!timestamps.isEmpty() && Duration.between(timestamps.peekFirst(), now).compareTo(WINDOW) > 0) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= MAX_REQUESTS) {
                return false;
            }
            timestamps.addLast(now);
            return true;
        }
    }
}
