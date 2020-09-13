package com.vimofthevine.underbudget.integration

import org.hamcrest.Matchers.*

import java.time.Instant

import io.restassured.RestAssured.*
import io.restassured.module.kotlin.extensions.*

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class EnvelopeTest : AbstractIntegrationTest() {
  var ledgerId: String = ""

  @BeforeEach
  fun createLedger() {
    ledgerId =
      Given {
        header("Authorization", "Bearer $jwt")
        body(mapOf(
          "name" to "Ledger Name",
          "currency" to 840
        ))
      } When {
        post("/api/ledgers")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }
  }

  @Test
  fun `envelope resources requires authentication`() {
    When {
      get("/api/envelope-categories")
    } Then {
      statusCode(401)
    }

    When {
      get("/api/envelopes")
    } Then {
      statusCode(401)
    }
  }

  @Test
  fun `envelope category resource requires valid parameters`() {
    setupAuth()

    // Invalid ledger
    Given {
      body(mapOf(
        "Ledger" to "/api/ledgers/$ledgerId",
        "name" to "Envelope name"
      ))
    } When {
      post("/api/envelope-categories")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "ledger" to "$ledgerId",
        "name" to "Envelope name"
      ))
    } When {
      post("/api/envelope-categories")
    } Then {
      statusCode(greaterThanOrEqualTo(400))
    }

    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/00000000-0000-0000-0000-000000000000",
        "name" to "Envelope name"
      ))
    } When {
      post("/api/envelope-categories")
    } Then {
      statusCode(greaterThanOrEqualTo(400))
    }

    // Invalid name
    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "Name" to "Envelope Name"
      ))
    } When {
      post("/api/envelope-categories")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to ""
      ))
    } When {
      post("/api/envelope-categories")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to null
      ))
    } When {
      post("/api/envelope-categories")
    } Then {
      statusCode(400)
    }
  }

  @Test
  fun `envelope resource requires valid parameters`() {
    setupAuth()

    val catId: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category name"
        ))
      } When {
        post("/api/envelope-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    // Invalid category
    Given {
      body(mapOf(
        "Category" to "/api/envelope-categories/$catId",
        "name" to " name"
      ))
    } When {
      post("/api/envelopes")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "category" to "/api/ledgers/$ledgerId",
        "name" to "Envelope name"
      ))
    } When {
      post("/api/envelopes")
    } Then {
      statusCode(greaterThanOrEqualTo(400))
    }

    Given {
      body(mapOf(
        "category" to "/api/envelope-categories/00000000-0000-0000-0000-000000000000",
        "name" to "Envelope name"
      ))
    } When {
      post("/api/envelopes")
    } Then {
      statusCode(greaterThanOrEqualTo(400))
    }

    Given {
      body(mapOf(
        "category" to "$catId",
        "name" to "Envelope name"
      ))
    } When {
      post("/api/envelopes")
    } Then {
      statusCode(greaterThanOrEqualTo(400))
    }

    // Invalid name
    Given {
      body(mapOf(
        "category" to "/api/envelope-categories/$catId",
        "Name" to "Envelope Name"
      ))
    } When {
      post("/api/envelopes")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "category" to "/api/envelope-categories/$catId",
        "name" to ""
      ))
    } When {
      post("/api/envelopes")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "category" to "/api/envelope-categories/$catId",
        "name" to null
      ))
    } When {
      post("/api/envelopes")
    } Then {
      statusCode(400)
    }

    // Invalid archived
    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to "Envelope name",
        "archived" to null
      ))
    } When {
      post("/api/envelopes")
    } Then {
      statusCode(400)
    }

    // Invalid external ID
    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to "Envelope name",
        "externalId" to null
      ))
    } When {
      post("/api/envelopes")
    } Then {
      statusCode(400)
    }
  }

  @Test
  fun `envelope resource is audited`() {
    setupAuth()

    val catId: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category name"
        ))
      } When {
        post("/api/envelope-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    val postResponse =
      Given {
        body(mapOf(
          "category" to "/api/envelope-categories/$catId",
          "name" to "Envlope name"
        ))
      } When {
        post("/api/envelopes")
      } Then {
        statusCode(201)
        body("name", equalTo("Envlope name"))
        body("archived", equalTo(false))
        body("externalId", equalTo(""))
      } Extract {
        response()
      }

    val id = postResponse.path<String>("id")
    val created = Instant.parse(postResponse.path("created"))
    assertEquals(created, Instant.parse(postResponse.path("lastUpdated")))

    Given {
      body(mapOf(
        "category" to "/api/envelope-categories/$catId",
        "name" to "Envelope name"
      ))
    } When {
      put("/api/envelopes/$id")
    } Then {
      statusCode(200)
      body("name", equalTo("Envelope name"))
      body("created", equalTo(created.toString()))
      body("lastUpdated", not(equalTo(created.toString())))
    }

    Given {
      body(mapOf(
        "category" to "/api/envelope-categories/$catId",
        "name" to "Envelope name",
        "archived" to true,
        "externalId" to "firstborn",
        "created" to Instant.ofEpochSecond(1000),
        "lastUpdated" to Instant.ofEpochSecond(2000)
      ))
    } When {
      put("/api/envelopes/$id")
    } Then {
      statusCode(200)
      body("name", equalTo("Envelope name"))
      body("archived", equalTo(true))
      body("externalId", equalTo("firstborn"))
      body("created", equalTo(created.toString()))
      body("lastUpdated", not(equalTo(Instant.ofEpochSecond(2000).toString())))
  }

    Given {
      body(mapOf(
        "name" to "Patched Envelope",
        "created" to Instant.ofEpochSecond(1000),
        "lastUpdated" to Instant.ofEpochSecond(2000)
      ))
    } When {
      patch("/api/envelopes/$id")
    } Then {
      statusCode(200)
      body("name", equalTo("Patched Envelope"))
      body("archived", equalTo(true))
      body("externalId", equalTo("firstborn"))
      body("created", equalTo(created.toString()))
      body("lastUpdated", not(equalTo(Instant.ofEpochSecond(2000).toString())))
    }
  }

  @Test
  fun `can fetch all envelopes by category`() {
    setupAuth()

    val catId1: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category 1"
        ))
      } When {
        post("/api/envelope-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    val catId2: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category 2"
        ))
      } When {
        post("/api/envelope-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    val catId3: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category 3"
        ))
      } When {
        post("/api/envelope-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    val acctId1: String =
      Given {
        body(mapOf(
          "category" to "/api/envelope-categories/$catId2",
          "name" to "Envelope 1"
        ))
      } When {
        post("/api/envelopes")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    val acctId2: String =
      Given {
        body(mapOf(
          "category" to "/api/envelope-categories/$catId1",
          "name" to "Envelope 2"
        ))
      } When {
        post("/api/envelopes")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    val acctId3: String =
      Given {
        body(mapOf(
          "category" to "/api/envelope-categories/$catId2",
          "name" to "Envelope 3"
        ))
      } When {
        post("/api/envelopes")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    When {
      get("/api/ledgers/$ledgerId/envelopeCategories?projection=categoryWithEnvelopes")
    } Then {
      statusCode(200)
      body("_embedded.envelopeCategories.id", contains(catId1, catId2, catId3))

      rootPath("_embedded.envelopeCategories.find { it.id == '$catId1' }")
      body("name", equalTo("Category 1"))
      body("envelopes", hasSize<List<*>>(1))
      body("envelopes[0].id", equalTo(acctId2))
      body("envelopes[0].name", equalTo("Envelope 2"))
      body("envelopes[0].archived", equalTo(false))

      rootPath("_embedded.envelopeCategories.find { it.id == '$catId2' }")
      body("name", equalTo("Category 2"))
      body("envelopes.id", contains(acctId1, acctId3))
      body("envelopes.name", contains("Envelope 1", "Envelope 3"))

      rootPath("_embedded.envelopeCategories.find { it.id == '$catId3' }")
      body("name", equalTo("Category 3"))
      body("envelopes", hasSize<List<*>>(0))
    }
  }

  @Test
  fun `deletion of envelope category cascades to envelopes`() {
    setupAuth()

    val catId: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category Name"
        ))
      } When {
        post("/api/envelope-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    Given {
      body(mapOf(
        "category" to "/api/envelope-categories/$catId",
        "name" to "Envelope Name"
      ))
    } When {
      post("/api/envelopes")
    } Then {
      statusCode(201)
    }

    When {
      get("/api/envelopes")
    } Then {
      statusCode(200)
      body("_embedded.envelopes.size()", equalTo(1))
    }

    When {
      delete("/api/envelope-categories/$catId")
    } Then {
      statusCode(204)
    }

    When {
      get("/api/envelopes")
    } Then {
      statusCode(200)
      body("_embedded.envelopes.size()", equalTo(0))
    }
  }

  @Test
  fun `deletion of ledger cascades to envelope categories`() {
    setupAuth()

    val catId: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category Name"
        ))
      } When {
        post("/api/envelope-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    When {
      get("/api/envelope-categories/${catId}")
    } Then {
      statusCode(200)
    }

    When {
      delete("/api/ledgers/${ledgerId}")
    } Then {
      statusCode(204)
    }

    When {
      get("/api/envelope-categories/${catId}")
    } Then {
      statusCode(404)
    }
  }
}
