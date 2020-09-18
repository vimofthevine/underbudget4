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
  fun `account resources requires authentication`() {
    When {
      get("/api/account-categories")
    } Then {
      statusCode(401)
    }

    When {
      get("/api/accounts")
    } Then {
      statusCode(401)
    }
  }

  @Test
  fun `account category resource requires valid parameters`() {
    setupAuth()

    // Invalid ledger
    Given {
      body(mapOf(
        "Ledger" to "/api/ledgers/$ledgerId",
        "name" to "Account name"
      ))
    } When {
      post("/api/account-categories")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "ledger" to "$ledgerId",
        "name" to "Account name"
      ))
    } When {
      post("/api/account-categories")
    } Then {
      statusCode(greaterThanOrEqualTo(400))
    }

    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/00000000-0000-0000-0000-000000000000",
        "name" to "Account name"
      ))
    } When {
      post("/api/account-categories")
    } Then {
      statusCode(greaterThanOrEqualTo(400))
    }

    // Invalid name
    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "Name" to "Category Name"
      ))
    } When {
      post("/api/account-categories")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to ""
      ))
    } When {
      post("/api/account-categories")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "ledger" to "/api/ledgers/$ledgerId",
        "name" to null
      ))
    } When {
      post("/api/account-categories")
    } Then {
      statusCode(400)
    }
  }

  @Test
  fun `account resource requires valid parameters`() {
    setupAuth()

    val catId: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category name"
        ))
      } When {
        post("/api/account-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    // Invalid category
    Given {
      body(mapOf(
        "Category" to "/api/account-categories/$catId",
        "name" to "Account name"
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "category" to "/api/ledgers/$ledgerId",
        "name" to "Account name"
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(greaterThanOrEqualTo(400))
    }

    Given {
      body(mapOf(
        "category" to "/api/account-categories/00000000-0000-0000-0000-000000000000",
        "name" to "Account name"
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(greaterThanOrEqualTo(400))
    }

    Given {
      body(mapOf(
        "category" to "$catId",
        "name" to "Account name"
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(greaterThanOrEqualTo(400))
    }

    // Invalid name
    Given {
      body(mapOf(
        "category" to "/api/account-categories/$catId",
        "Name" to "Account Name"
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "category" to "/api/account-categories/$catId",
        "name" to ""
      ))
    } When {
      post("/api/accounts")
    } Then {
      statusCode(400)
    }

    Given {
      body(mapOf(
        "category" to "/api/account-categories/$catId",
        "name" to null
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
  }

  @Test
  fun `ledger resource is audited`() {
    setupAuth()

    val catId: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category name"
        ))
      } When {
        post("/api/account-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    val postResponse =
      Given {
        body(mapOf(
          "category" to "/api/account-categories/$catId",
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
        "category" to "/api/account-categories/$catId",
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
        "category" to "/api/account-categories/$catId",
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
  fun `can fetch all accounts by category`() {
    setupAuth()

    val catId1: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category 1"
        ))
      } When {
        post("/api/account-categories")
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
        post("/api/account-categories")
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
        post("/api/account-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    val acctId1: String =
      Given {
        body(mapOf(
          "category" to "/api/account-categories/$catId2",
          "name" to "Account 1"
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
          "category" to "/api/account-categories/$catId1",
          "name" to "Account 2"
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
          "category" to "/api/account-categories/$catId2",
          "name" to "Account 3"
        ))
      } When {
        post("/api/accounts")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    When {
      get("/api/ledgers/$ledgerId/accountCategories?projection=categoryWithAccounts")
    } Then {
      statusCode(200)
      body("_embedded.accountCategories.id", contains(catId1, catId2, catId3))

      rootPath("_embedded.accountCategories.find { it.id == '$catId1' }")
      body("name", equalTo("Category 1"))
      body("accounts", hasSize<List<*>>(1))
      body("accounts[0].id", equalTo(acctId2))
      body("accounts[0].name", equalTo("Account 2"))
      body("accounts[0].archived", equalTo(false))
      body("accounts[0]", not(hasKey<String>("accountNumber")))

      rootPath("_embedded.accountCategories.find { it.id == '$catId2' }")
      body("name", equalTo("Category 2"))
      body("accounts.id", contains(acctId1, acctId3))
      body("accounts.name", contains("Account 1", "Account 3"))

      rootPath("_embedded.accountCategories.find { it.id == '$catId3' }")
      body("name", equalTo("Category 3"))
      body("accounts", hasSize<List<*>>(0))
    }
  }

  @Test
  fun `deletion of account category cascades to accounts`() {
    setupAuth()

    val catId: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category Name"
        ))
      } When {
        post("/api/account-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    val acctId: String =
      Given {
        body(mapOf(
          "category" to "/api/account-categories/$catId",
          "name" to "Account Name"
        ))
      } When {
        post("/api/accounts")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    When {
      get("/api/accounts")
    } Then {
      statusCode(200)
      body("_embedded.accounts.id", hasItems(acctId))
    }

    When {
      delete("/api/account-categories/$catId")
    } Then {
      statusCode(204)
    }

    When {
      get("/api/accounts")
    } Then {
      statusCode(200)
      body("_embedded.accounts.id", not(hasItems(acctId)))
    }
  }

  @Test
  fun `deletion of ledger cascades to account categories`() {
    setupAuth()

    val catId: String =
      Given {
        body(mapOf(
          "ledger" to "/api/ledgers/$ledgerId",
          "name" to "Category Name"
        ))
      } When {
        post("/api/account-categories")
      } Then {
        statusCode(201)
      } Extract {
        path("id")
      }

    When {
      get("/api/account-categories/${catId}")
    } Then {
      statusCode(200)
    }

    When {
      delete("/api/ledgers/${ledgerId}")
    } Then {
      statusCode(204)
    }

    When {
      get("/api/account-categories/${catId}")
    } Then {
      statusCode(404)
    }
  }
}