package com.vimofthevine.underbudget.controller

import com.nhaarman.mockitokotlin2.mock
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.vimofthevine.underbudget.repository.TokenRepository
import com.vimofthevine.underbudget.security.*

import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.SpyBean
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
abstract class AbstractControllerTest {
  @MockBean
  lateinit var mockTokenRepo: TokenRepository

  @SpyBean
  lateinit var jwtTokenProvider: JwtTokenProvider

  val objectMapper = ObjectMapper().registerModule(KotlinModule())
}