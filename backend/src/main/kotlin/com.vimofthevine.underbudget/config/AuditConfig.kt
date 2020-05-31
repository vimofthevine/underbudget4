package com.vimofthevine.underbudget.config

import java.util.Optional

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.domain.AuditorAware
import org.springframework.data.jpa.repository.config.EnableJpaAuditing

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
class AuditConfig {
  @Bean
  fun auditorProvider(): AuditorAware<String> {
    return AuditorAware { Optional.of("") };
  }
}
