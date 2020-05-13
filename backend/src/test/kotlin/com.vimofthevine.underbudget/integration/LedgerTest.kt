package com.vimofthevine.underbudget.integration

import org.hamcrest.Matchers.*

import java.time.Instant
import java.util.UUID

import io.restassured.RestAssured.*
import io.restassured.module.kotlin.extensions.*

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class LedgerTest : AbstractIntegrationTest() {
  @Test
  fun `ledger resource requires authentication`() {
    Given {
      body(mapOf(
        "name" to "Ledger Name",
        "currency" to 840
      ))
    } When {
      post("/api/ledgers")
    } Then {
      statusCode(401)
    }

    When {
      get("/api/ledgers")
    } Then {
      statusCode(401)
    }

    When {
      get("/api/ledgers/11112222-3333-4444-5555-666677778888")
    } Then {
      statusCode(401)
    }

    Given {
      body(mapOf(
        "name" to "Ledger Name",
        "currency" to 840
      ))
    } When {
      put("/api/ledgers/11112222-3333-4444-5555-666677778888")
    } Then {
      statusCode(401)
    }

    When {
      delete("/api/ledgers/11112222-3333-4444-5555-666677778888")
    } Then {
      statusCode(401)
    }
  }

  @Test
  fun `ledger resource requires valid parameters`() {
    setupAuth()

    // Invalid name
    Given {
      body(mapOf(
        "Name" to "Ledger Name",
        "currency" to 840
      ))
    }
    When {
      post("/api/ledgers")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "name" to "",
        "currency" to 840
      ))
    }
    When {
      post("/api/ledgers")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "name" to null,
        "currency" to 840
      ))
    }
    When {
      post("/api/ledgers")
    } Then {
      statusCode(400)
    }

    // Invalid currency
    Given {
      body(mapOf(
        "name" to "Ledger Name",
        "Currency" to 840
      ))
    }
    When {
      post("/api/ledgers")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "name" to "Ledger Name",
        "currency" to 0
      ))
    }
    When {
      post("/api/ledgers")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "name" to "Ledger Name",
        "currency" to null
      ))
    }
    When {
      post("/api/ledgers")
    } Then {
      statusCode(400)
    }
  }

  @Test
  fun `ledger resource is paginated`() {
    setupAuth()

    Given {
      body(mapOf(
        "name" to "Ledger Name",
        "currency" to 840
      ))
    } When {
      post("/api/ledgers")
    } Then {
      statusCode(201)
      body("name", equalTo("Ledger Name"))
      body("currency", equalTo(840))
    }

    When {
      get("/api/ledgers?size=2")
    } Then {
      statusCode(200)
      body("_embedded.ledgers.name", hasItem("Ledger Name"))
      body("page.size", equalTo(2))
      body("page.totalElements", equalTo(1))
      body("page.totalPages", equalTo(1))
      body("page.number", equalTo(0))
    }

    for (i in 0..9) {
      Given {
        body(mapOf(
          "name" to "Ledger $i",
          "currency" to 840
        ))
      } When {
        post("/api/ledgers")
      } Then {
        statusCode(201)
      }
    }

    When {
      get("/api/ledgers?size=2")
    } Then {
      statusCode(200)
      body("page.size", equalTo(2))
      body("page.totalElements", equalTo(11))
      body("page.totalPages", equalTo(6))
      body("page.number", equalTo(0))
    }

    When {
      get("/api/ledgers?size=2&page=3")
    } Then {
      statusCode(200)
      body("page.size", equalTo(2))
      body("page.totalElements", equalTo(11))
      body("page.totalPages", equalTo(6))
      body("page.number", equalTo(3))
    }

    When {
      get("/api/ledgers?size=2&sort=name")
    } Then {
      statusCode(200)
      body("_embedded.ledgers[0].name", equalTo("Ledger 0"))
      body("_embedded.ledgers[1].name", equalTo("Ledger 1"))
    }

    When {
      get("/api/ledgers?size=2&sort=name,desc")
    } Then {
      statusCode(200)
      body("_embedded.ledgers[0].name", equalTo("Ledger Name"))
      body("_embedded.ledgers[1].name", equalTo("Ledger 9"))
    }
  }

  @Test
  fun `ledger resource is audited`() {
    setupAuth()

    val postResponse = Given {
      body(mapOf(
        "name" to "Audited eLdger",
        "currency" to 840
      ))
    } When {
      post("/api/ledgers")
    } Then {
      statusCode(201)
      body("name", equalTo("Audited eLdger"))
      body("currency", equalTo(840))
    } Extract {
      response()
    }

    val id = postResponse.path<String>("id");
    val created = Instant.parse(postResponse.path("created"))
    assertEquals(created, Instant.parse(postResponse.path("lastUpdated")))

    Given {
      body(mapOf(
        "name" to "Audited Ledger",
        "currency" to 978
      ))
    } When {
      put("/api/ledgers/$id")
    } Then {
      statusCode(200)
      body("name", equalTo("Audited Ledger"))
      body("currency", equalTo(978))
      body("created", equalTo(created.toString()))
      body("lastUpdated", not(equalTo(created.toString())))
    }

    Given {
      body(mapOf(
        "name" to "Bypass Auditing Ledger",
        "currency" to 123,
        "created" to Instant.ofEpochSecond(1000),
        "lastUpdated" to Instant.ofEpochSecond(2000)
      ))
    } When {
      put("/api/ledgers/$id")
    } Then {
      statusCode(200)
      body("name", equalTo("Bypass Auditing Ledger"))
      body("currency", equalTo(123))
      body("created", equalTo(created.toString()))
      body("lastUpdated", not(equalTo(Instant.ofEpochSecond(2000).toString())))
    }

    Given {
      body(mapOf(
        "name" to "Patched Ledger",
        "currency" to 456,
        "created" to Instant.ofEpochSecond(1000),
        "lastUpdated" to Instant.ofEpochSecond(2000)
      ))
    } When {
      patch("/api/ledgers/$id")
    } Then {
      statusCode(200)
      body("name", equalTo("Patched Ledger"))
      body("currency", equalTo(456))
      body("created", equalTo(created.toString()))
      body("lastUpdated", not(equalTo(Instant.ofEpochSecond(2000).toString())))
    }
  }
}