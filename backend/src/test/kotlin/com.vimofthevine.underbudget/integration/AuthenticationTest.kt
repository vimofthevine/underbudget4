package com.vimofthevine.underbudget.integration

import io.restassured.RestAssured.*
import io.restassured.module.kotlin.extensions.*

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class AuthenticationTest : AbstractIntegrationTest() {
  @Test
  fun `should create access token`() {
    // Missing password
    Given {
      body(mapOf(
        "passcode" to "testpassword",
        "source" to "authtest"
      ))
    } When {
      post("/api/tokens")
    } Then {
      statusCode(400)
    }

    // Blank password
    Given {
      body(mapOf(
        "password" to "",
        "source" to "authtest"
      ))
    } When {
      post("/api/tokens")
    } Then {
      statusCode(400)
    }

    // Missing source
    Given {
      body(mapOf(
        "password" to "testpassword",
        "src" to "authtest"
      ))
    } When {
      post("/api/tokens")
    } Then {
      statusCode(400)
    }

    // Blank source
    Given {
      body(mapOf(
        "passworld" to "testpassword",
        "source" to ""
      ))
    } When {
      post("/api/tokens")
    } Then {
      statusCode(400)
    }

    // Bad credentials
    Given {
      body(mapOf(
        "password" to "wrongpassword",
        "source" to "authtest"
      ))
    } When {
      post("/api/tokens")
    } Then {
      statusCode(401)
    }

    // Success
    Given {
      body(mapOf(
        "password" to "testpassword",
        "source" to "authtest"
      ))
    } When {
      post("/api/tokens")
    } Then {
      statusCode(201)
    }
  }
}