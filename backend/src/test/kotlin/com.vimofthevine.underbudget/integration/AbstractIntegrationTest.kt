package com.vimofthevine.underbudget.integration

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.test.context.ActiveProfiles

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
abstract class AbstractIntegrationTest {
  @LocalServerPort
  var localServerPort: Int = 0

  @Autowired
  lateinit var restTemplate: TestRestTemplate

  fun url(endpoint: String) = "http://localhost:$localServerPort$endpoint"
}
