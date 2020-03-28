package com.vimofthevine.underbudget.controller

import com.nhaarman.mockitokotlin2.*
import com.vimofthevine.underbudget.dto.TokenResponse
import com.vimofthevine.underbudget.security.JwtAuthenticationFilter
import com.vimofthevine.underbudget.service.TokenService

import java.util.UUID

import org.hamcrest.Matchers.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.test.web.servlet.setup.MockMvcBuilders.*
import org.springframework.web.server.ResponseStatusException

@WebMvcTest(AuthController::class)
@Disabled
class AuthControllerTest: AbstractControllerTest() {
  @MockBean
  lateinit var tokens: TokenService

  @Autowired
  lateinit var mvc: MockMvc

  @Test
  fun `create token should reject when missing password`() {
    mvc.perform(post("/api/authenticate").contentType(MediaType.APPLICATION_JSON)
      .content(objectMapper.writeValueAsString(mapOf(
        "passcode" to "testpass",
        "source" to "requestsrc"
      ))))
      .andExpect(status().isBadRequest)
      .andExpect(jsonPath("$.message", equalTo("Validation Failed")))

    mvc.perform(post("/api/authenticate").contentType(MediaType.APPLICATION_JSON)
      .content(objectMapper.writeValueAsString(mapOf(
        "password" to "",
        "source" to "requestsrc"
      ))))
      .andExpect(status().isBadRequest)
      .andExpect(jsonPath("$.message", equalTo("Validation Failed")))
  }

  @Test
  fun `create token should reject when missing source`() {
    mvc.perform(post("/api/authenticate").contentType(MediaType.APPLICATION_JSON)
      .content(objectMapper.writeValueAsString(mapOf(
        "password" to "testpass",
        "src" to "requestsrc"
      ))))
      .andExpect(status().isBadRequest)
      .andExpect(jsonPath("$.message", equalTo("Validation Failed")))

    mvc.perform(post("/api/authenticate").contentType(MediaType.APPLICATION_JSON)
      .content(objectMapper.writeValueAsString(mapOf(
        "password" to "testpass",
        "source" to ""
      ))))
      .andExpect(status().isBadRequest)
      .andExpect(jsonPath("$.message", equalTo("Validation Failed")))
  }

  @Test
  fun `create token should reject when bad credentials`() {
    whenever(tokens.authenticate(any())).thenThrow(BadCredentialsException("Bad Creds"))
    mvc.perform(post("/api/authenticate").contentType(MediaType.APPLICATION_JSON)
      .content(objectMapper.writeValueAsString(mapOf(
        "password" to "testpass",
        "source" to "requestsrc"
      ))))
      .andExpect(status().isUnauthorized)
  }

  @Test
  fun `login should succeed with valid credentials`() {
    whenever(tokens.authenticate(any())).thenReturn(TokenResponse(token = "jwtToken"))
    mvc.perform(post("/api/authenticate").contentType(MediaType.APPLICATION_JSON)
      .content(objectMapper.writeValueAsString(mapOf(
        "password" to "testpass",
        "source" to "requestsrc"
      ))))
      .andExpect(status().isCreated)
      .andExpect(jsonPath("$.token", equalTo("jwtToken")))
  }
}