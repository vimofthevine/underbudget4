package com.vimofthevine.underbudget.integration

import org.hamcrest.Matchers.*

import java.time.Instant

import io.restassured.RestAssured.*
import io.restassured.module.kotlin.extensions.*

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class AccountTest : AbstractIntegrationTest() {
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
  fun `account resource requires authentication`() {
    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to "Account Name"
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(401)
    }

    When {
      get("/api/accounts")
    } Then {
      statusCode(401)
    }

    When {
      get("/api/accounts/11112222-3333-4444-5555-666677778888")
    } Then {
      statusCode(401)
    }

    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to "Account Name"
      ))
    } When {
      put("/api/accounts/11112222-3333-4444-5555-666677778888")
    } Then {
      statusCode(401)
    }

    When {
      delete("/api/accounts/11112222-3333-4444-5555-666677778888")
    } Then {
      statusCode(401)
    }
  }

  @Test
  fun `account resource requires valid parameters`() {
    setupAuth()

    // Invalid name
    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "Name" to "Account Name"
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to ""
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "name" to null,
        "ledger" to "/api/ledgers/$ledgerId"
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }

    // Invalid ledger
    Given {
      body(mapOf(
        "Ledger" to "/api/ledgers/$ledgerId",
        "name" to "Account name"
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "ledger" to "$ledgerId",
        "name" to "Account name"
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(greaterThanOrEqualTo(400))
    }

    // Invalid institution
    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to "Account name",
        "institution" to null
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }

    // Invalid account number
    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to "Account name",
        "accountNumber" to null
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }

    // Invalid archived
    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to "Account name",
        "archived" to null
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }

    // Invalid external ID
    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to "Account name",
        "externalId" to null
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }

    // Invalid institution
    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to "Account name",
        "institution" to null
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }
  }

  @Test
  fun `ledger resource is audited`() {
    setupAuth()

    val postResponse =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Acount name"
        ))
      } When {
        post("/api/accounts")
      } Then {
        statusCode(201)
        body("name", equalTo("Acount name"))
        body("institution", equalTo(""))
        body("accountNumber", equalTo(""))
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
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to "Account name"
      ))
    } When {
      put("/api/accounts/$id")
    } Then {
      statusCode(200)
      body("name", equalTo("Account name"))
      body("created", equalTo(created.toString()))
      body("lastUpdated", not(equalTo(created.toString())))
    }

    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to "Account name",
        "institution" to "Bank of Dad",
        "accountNumber" to "1",
        "archived" to true,
        "externalId" to "firstborn",
        "created" to Instant.ofEpochSecond(1000),
        "lastUpdated" to Instant.ofEpochSecond(2000)
      ))
    } When {
      put("/api/accounts/$id")
    } Then {
      statusCode(200)
      body("name", equalTo("Account name"))
      body("institution", equalTo("Bank of Dad"))
      body("accountNumber", equalTo("1"))
      body("archived", equalTo(true))
      body("externalId", equalTo("firstborn"))
      body("created", equalTo(created.toString()))
      body("lastUpdated", not(equalTo(Instant.ofEpochSecond(2000).toString())))
  }

    Given {
      body(mapOf(
        "name" to "Patched Account",
        "created" to Instant.ofEpochSecond(1000),
        "lastUpdated" to Instant.ofEpochSecond(2000)
      ))
    } When {
      patch("/api/accounts/$id")
    } Then {
      statusCode(200)
      body("name", equalTo("Patched Account"))
      body("institution", equalTo("Bank of Dad"))
      body("accountNumber", equalTo("1"))
      body("archived", equalTo(true))
      body("externalId", equalTo("firstborn"))
      body("created", equalTo(created.toString()))
      body("lastUpdated", not(equalTo(Instant.ofEpochSecond(2000).toString())))
    }
  }

  @Test
  fun `account resources can be nested in accounts`() {
    setupAuth()

    val acctId1: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Parent"
        ))
      } When {
        post("/api/accounts")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }
    
    val acctId2: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "parent" to "/api/accounts/$acctId1",
          "name" to "Child"
        ))
      } When {
        post("/api/accounts")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    val acctId3: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "parent" to "/api/accounts/$acctId1",
          "name" to "Sibling",
          "archived" to true
        ))
      } When {
        post("/api/accounts")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    val acctId4: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "parent" to "/api/accounts/$acctId2",
          "name" to "Grandchild"
        ))
      } When {
        post("/api/accounts")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    When {
      get("/api/ledgers/$ledgerId/accounts?projection=accountTreeNode")
    } Then {
      statusCode(200)
      body("_embedded.accounts.id", contains(acctId1, acctId2, acctId3, acctId4))

      rootPath("_embedded.accounts.find { it.id == '$acctId1' }")
      body("id", equalTo(acctId1),
        "name", equalTo("Parent"),
        "archived", equalTo(false),
        "parentId", equalTo(null)
      )

      rootPath("_embedded.accounts.find { it.id == '$acctId2' }")
      body("id", equalTo(acctId2),
        "name", equalTo("Child"),
        "archived", equalTo(false),
        "parentId", equalTo(acctId1)
      )

      rootPath("_embedded.accounts.find { it.id == '$acctId3' }")
      body("id", equalTo(acctId3),
        "name", equalTo("Sibling"),
        "archived", equalTo(true),
        "parentId", equalTo(acctId1)
      )

      rootPath("_embedded.accounts.find { it.id == '$acctId4' }")
      body("id", equalTo(acctId4),
        "name", equalTo("Grandchild"),
        "archived", equalTo(false),
        "parentId", equalTo(acctId2)
      )
    }
  }

  @Test
  fun `deletion of ledger cascades to accounts`() {
    setupAuth()

    val acctId: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Account"
        ))
      } When {
        post("/api/accounts")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    When {
      get("/api/accounts/${acctId}")
    } Then {
      statusCode(200)
    }

    When {
      delete("/api/ledgers/${ledgerId}")
    } Then {
      statusCode(204)
    }

    When {
      get("/api/accounts/${acctId}")
    } Then {
      statusCode(404)
    }
  }
}