package com.vimofthevine.underbudget.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.*
import com.vimofthevine.underbudget.dto.TokenResponse
import com.vimofthevine.underbudget.service.TokenService

import java.util.UUID

import org.hamcrest.Matchers.*
import org.junit.jupiter.api.Assertions.*
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

@WebMvcTest(TokenController::class)
class TokenControllerTest : AbstractControllerTest() {
  @MockBean
  lateinit var service: TokenService

  @Autowired
  lateinit var mvc: MockMvc

  @Test
  fun `login should reject when missing name`() {
    mvc.perform(post("/api/tokens").contentType(MediaType.APPLICATION_JSON)
      .content(ObjectMapper().writeValueAsString(mapOf(
        "username" to "testuser",
        "password" to "testpass"
      ))))
      .andExpect(status().isBadRequest)
      .andExpect(jsonPath("$.message", equalTo("Validation Failed")))
  }

  @Test
  fun `login should reject when missing password`() {
    mvc.perform(post("/api/tokens").contentType(MediaType.APPLICATION_JSON)
      .content(ObjectMapper().writeValueAsString(mapOf(
        "name" to "testuser",
        "passcode" to "testpass"
      ))))
      .andExpect(status().isBadRequest)
      .andExpect(jsonPath("$.message", equalTo("Validation Failed")))
  }

  @Test
  fun `login should reject when bad credentials`() {
    whenever(service.authenticate(any())).thenThrow(BadCredentialsException("Bad Creds"))
    mvc.perform(post("/api/tokens").contentType(MediaType.APPLICATION_JSON)
      .content(ObjectMapper().writeValueAsString(mapOf(
        "name" to "testuser",
        "password" to "testpass"
      ))))
      .andExpect(status().isUnauthorized)
  }

  @Test
  fun `login should succeed with valid credentials`() {
    whenever(service.authenticate(any())).thenReturn(TokenResponse(token = "jwtToken"))
    mvc.perform(post("/api/tokens").contentType(MediaType.APPLICATION_JSON)
      .content(ObjectMapper().writeValueAsString(mapOf(
        "name" to "testuser",
        "password" to "testpass"
      ))))
      .andExpect(status().isOk)
      .andExpect(jsonPath("$.token", equalTo("jwtToken")))
  }
}