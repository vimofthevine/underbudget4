package com.vimofthevine.underbudget.config

import org.springframework.beans.factory.InitializingBean
import org.springframework.context.annotation.Configuration
import org.springframework.data.rest.core.event.ValidatingRepositoryEventListener
import org.springframework.validation.Validator

@Configuration
class ValidatorConfig(
  private val listener: ValidatingRepositoryEventListener,
  private val validators: Map<String, Validator>
) : InitializingBean {
  override fun afterPropertiesSet() {
    val events = listOf("beforeCreate", "beforeSave")
    for (entry in validators.entries) {
      events.stream().filter({ entry.key.startsWith(it) })
        .findFirst().ifPresent({ listener.addValidator(it, entry.value) })
    }
  }
}