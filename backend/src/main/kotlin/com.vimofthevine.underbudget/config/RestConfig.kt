package com.vimofthevine.underbudget.config

import javax.persistence.EntityManager

import org.springframework.context.annotation.Configuration
import org.springframework.data.rest.core.config.RepositoryRestConfiguration
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer

@Configuration
class RestConfig(
  private val entityManager: EntityManager
) : RepositoryRestConfigurer {

  override fun configureRepositoryRestConfiguration(config: RepositoryRestConfiguration) {
    config.exposeIdsFor(*entityManager.metamodel.entities.map { it.javaType }.toTypedArray())
  }
}
