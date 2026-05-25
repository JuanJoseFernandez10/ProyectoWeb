package com.groovelink.configuration;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        // TODO: Add TTL configuration. Consider switching to Caffeine cache manager
        // with .expireAfterWrite(Duration.ofMinutes(10)) for production.
        return new ConcurrentMapCacheManager(
                "eventos",
                "eventosList",
                "eventosFuturos",
                "personas",
                "personasPremium",
                "aptitudes",
                "generos"
        );
    }
}
