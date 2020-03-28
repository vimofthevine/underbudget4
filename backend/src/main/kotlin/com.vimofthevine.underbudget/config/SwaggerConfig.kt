package com.vimofthevine.underbudget.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import

import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration
import springfox.documentation.builders.PathSelectors
import springfox.documentation.service.ApiKey
import springfox.documentation.service.AuthorizationScope
import springfox.documentation.service.SecurityReference
import springfox.documentation.spi.DocumentationType
import springfox.documentation.spi.service.contexts.SecurityContext
import springfox.documentation.spring.data.rest.configuration.SpringDataRestConfiguration
import springfox.documentation.spring.web.plugins.Docket
import springfox.documentation.swagger2.annotations.EnableSwagger2WebMvc

@Configuration
@EnableSwagger2WebMvc
@Import(value = [
  BeanValidatorPluginsConfiguration::class,
  SpringDataRestConfiguration::class
])
class SwaggerConfig {
  @Bean
  fun docket() = Docket(DocumentationType.SWAGGER_2)
    .securityContexts(listOf(securityContext()))
    .securitySchemes(listOf(apiKey()))

  private fun apiKey() = ApiKey("Bearer", "Authorization", "header")

  private fun securityContext() = SecurityContext.builder()
    .securityReferences(defaultAuth())
    .forPaths(PathSelectors.any())
    .build()

  private fun defaultAuth() = listOf(
    SecurityReference("Bearer", arrayOf(AuthorizationScope("global", "accessEverything")))
  )
}