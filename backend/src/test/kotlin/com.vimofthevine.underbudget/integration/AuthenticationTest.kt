package com.vimofthevine.underbudget.integration

import org.hamcrest.Matchers.*

import java.util.UUID

import io.restassured.RestAssured.*
import io.restassured.module.kotlin.extensions.*

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class AuthenticationTest : AbstractIntegrationTest() {
  @Test
  fun `creating authentication token`() {
    // Missing password
    Given {
      body(mapOf(
        "passcode" to "testpassword",
        "source" to "authtest"
      ))
    } When {
      post("/api/authenticate")
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
      post("/api/authenticate")
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
      post("/api/authenticate")
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
      post("/api/authenticate")
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
      post("/api/authenticate")
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
      post("/api/authenticate")
    } Then {
      statusCode(201)
    }
  }

  @Test
  fun `managing authentication tokens`() {
    // Create a token
    val testJwt: String =
      Given {
        body(mapOf(
          "password" to "testpassword",
          "source" to "token-mgmt-test"
        ))
      } When {
        post("/api/authenticate")
      } Then {
        statusCode(201)
      } Extract {
        path("token")
      }

    // No token header
    When {
      get("/api/tokens")
    } Then {
      statusCode(401)
    }

    // Invalid header
    Given {
      header("Authorization", "open sesame!")
    } When {
      get("/api/tokens")
    } Then {
      statusCode(401)
    }

    // Invalid token
    Given {
      header("Authorization", "Bearer notatoken")
    } When {
      get("/api/tokens")
    } Then {
      statusCode(401)
    }

    // Valid token
    val href: String =
      Given {
        header("Authorization", "Bearer ${testJwt}")
      } When {
        get("/api/tokens")
      } Then {
        statusCode(200)
        body("_embedded.tokens.source", hasItem("token-mgmt-test"))
      } Extract {
        path("_embedded.tokens.find { it.source == 'token-mgmt-test' }._links.self.href")
      }

    // No post allowed
    Given {
      header("Authorization", "Bearer ${testJwt}")
      body(mapOf(
        "jwtId" to UUID.randomUUID(),
        "source" to "auth integ test"
      ))
    } When {
      post("/api/tokens")
    } Then {
      statusCode(405)
    }

    // No get allowed
    Given {
      header("Authorization", "Bearer ${testJwt}")
    } When {
      get(href)
    } Then {
      statusCode(405)
    }

    // No put allowed
    Given {
      header("Authorization", "Bearer ${testJwt}")
      body(mapOf(
        "jwtId" to UUID.randomUUID(),
        "source" to "auth integ test"
      ))
    } When {
      put(href)
    } Then {
      statusCode(405)
    }

    // Delete token
    Given {
      header("Authorization", "Bearer ${testJwt}")
    } When {
      delete(href)
    } Then {
      statusCode(204)
    }

    // Token has been revoked
    Given {
      header("Authorization", "Bearer ${testJwt}")
    } When {
      get("/api/tokens")
    } Then {
      statusCode(401)
    }
  }
}