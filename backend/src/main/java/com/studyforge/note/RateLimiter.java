package com.studyforge.note;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

/** Fixed-window limiter: N generations per user per minute, counted in Redis. */
@Component
public class RateLimiter {

    private final StringRedisTemplate redis;
    private final int maxPerMinute;

    public RateLimiter(StringRedisTemplate redis,
                       @Value("${studyforge.ai.max-requests-per-minute}") int maxPerMinute) {
        this.redis = redis;
        this.maxPerMinute = maxPerMinute;
    }

    public void check(String userId) {
        String key = "ratelimit:generate:" + userId;
        Long count = redis.opsForValue().increment(key);
        if (count != null && count == 1) {
            redis.expire(key, Duration.ofSeconds(60));
        }
        if (count != null && count > maxPerMinute) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "You can generate " + maxPerMinute + " study sets per minute. Wait a moment and try again.");
        }
    }
}
