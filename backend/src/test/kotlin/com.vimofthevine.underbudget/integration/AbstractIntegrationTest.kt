package com.vimofthevine.underbudget.integration

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.vimofthevine.underbudget.dto.UserIdResponse
import com.vimofthevine.underbudget.dto.UserRegistrationRequest

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
  val testUserName: String = "testuser"
  val testUserPassword: String = "testpassword"
  var testUserId: UUID = UUID.randomUUID()

  val objectMapper = ObjectMapper().registerModule(KotlinModule())

  @LocalServerPort
  var localServerPort: Int = 0

  @Autowired
  lateinit var restTemplate: TestRestTemplate

  fun url(endpoint: String) = "http://localhost:$localServerPort$endpoint"

  @BeforeEach
  fun registerTestUser() {
    println("KJT creating user")
    val response = restTemplate.postForEntity(url("/api/users"),
      UserRegistrationRequest(name = testUserName,
        password = testUserPassword, email = "user@test.com"),
      String::class.java)
    if (HttpStatus.CREATED == response.statusCode) {
      testUserId = objectMapper.readValue(response.body, UserIdResponse::class.java).userId
    }
  }
}
