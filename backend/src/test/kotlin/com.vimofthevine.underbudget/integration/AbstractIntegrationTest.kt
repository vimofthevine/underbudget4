package com.vimofthevine.underbudget.integration

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule

import io.restassured.RestAssured
import io.restassured.RestAssured.*
import io.restassured.builder.RequestSpecBuilder
import io.restassured.module.kotlin.extensions.*

import java.util.UUID

import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.http.HttpStatus
import org.springframework.test.context.ActiveProfiles

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
abstract class AbstractIntegrationTest {
  var jwt: String = ""

  @LocalServerPort
  var localServerPort: Int = 0

  @BeforeEach
  fun setup() {
    RestAssured.port = localServerPort
    RestAssured.requestSpecification =
      RequestSpecBuilder().setContentType("application/json").build()

    jwt = 
      Given {
        body(mapOf(
          "password" to "testpassword",
          "source" to "integrationtest"
        ))
      } When {
        post("/api/tokens")
      } Then {
        statusCode(201)
      } Extract {
        path("token")
      }
  }
}
