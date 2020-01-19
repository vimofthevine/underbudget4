package com.vimofthevine.underbudget.integration

import com.fasterxml.jackson.databind.ObjectMapper
import com.vimofthevine.underbudget.dto.*

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

class AuthenticationTest : AbstractIntegrationTest() {
  @Test
  fun `should register new user`() {
    val resp1 = restTemplate.postForEntity(url("/api/users"),
      UserRegistrationRequest(name = "bob", password = "password123456", email = "bob@test.com"),
      String::class.java)
    assertEquals(HttpStatus.BAD_REQUEST, resp1.statusCode)

    val resp2 = restTemplate.postForEntity(url("/api/users"),
      UserRegistrationRequest(name = "robert", password = "password123456", email = "bob@test.com"),
      String::class.java)
    assertEquals(HttpStatus.CREATED, resp2.statusCode)

    val resp3 = restTemplate.postForEntity(url("/api/users"),
      UserRegistrationRequest(name = "robert", password = "password246800", email = "robert@test.com"),
      String::class.java)
    assertEquals(HttpStatus.BAD_REQUEST, resp3.statusCode)
  }
}