package com.vimofthevine.underbudget.config

import javax.persistence.EntityManager

import org.springframework.context.annotation.Configuration
import org.springframework.data.rest.core.config.RepositoryRestConfiguration
import org.springframework.data.rest.core.event.ValidatingRepositoryEventListener
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer
import org.springframework.validation.Validator

@Configuration
class RestConfig(
  private val entityManager: EntityManager,
  private val validator: Validator
) : RepositoryRestConfigurer {

  override fun configureRepositoryRestConfiguration(config: RepositoryRestConfiguration) {
    config.exposeIdsFor(*entityManager.metamodel.entities.map { it.javaType }.toTypedArray())
  }

  override fun configureValidatingRepositoryEventListener(config: ValidatingRepositoryEventListener) {
    config.addValidator("beforeCreate", validator)
    config.addValidator("beforeSave", validator)
  }
}
