package com.vimofthevine.underbudget.runner

import com.vimofthevine.underbudget.model.*
import com.vimofthevine.underbudget.repository.*

import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component

@Component
class CreateDemoLedger(
  private val ledgers: LedgerRepository,
  private val accountCategories: AccountCategoryRepository,
  private val accounts: AccountRepository,
  private val envelopeCategories: EnvelopeCategoryRepository,
  private val envelopes: EnvelopeRepository,
) : ApplicationRunner {
  private val logger = LoggerFactory.getLogger(javaClass)

  override fun run(args: ApplicationArguments) {
    if (ledgers.count() == 0L) {
      logger.info("Creating demo ledger")

      val ledger = ledgers.save(Ledger(
        name = "Demo Ledger",
        currency = 840,
        created = null,
        lastUpdated = null,
      ))

      val assets = accountCategories.save(AccountCategory(
        ledger = ledger,
        name = "Assets",
      ))

      val liabilities = accountCategories.save(AccountCategory(
        ledger = ledger,
        name = "Liabilities",
      ))

      val checking = accounts.save(Account(
        category = assets,
        name = "Checking",
        institution = "Bank",
        created = null,
        lastUpdated = null,
      ))

      val savings = accounts.save(Account(
        category = assets,
        name = "Savings",
        institution = "Bank",
        created = null,
        lastUpdated = null,
      ))

      val cash = accounts.save(Account(
        category = assets,
        name = "Cash",
        created = null,
        lastUpdated = null,
      ))

      val visa = accounts.save(Account(
        category = liabilities,
        name = "Visa Credit Card",
        created = null,
        lastUpdated = null,
      ))

      val housing = envelopeCategories.save(EnvelopeCategory(
        ledger = ledger,
        name = "Housing",
      ))

      val eating = envelopeCategories.save(EnvelopeCategory(
        ledger = ledger,
        name = "Eating",
      ))

      val transportation = envelopeCategories.save(EnvelopeCategory(
        ledger = ledger,
        name = "Transportation",
      ))

      val luxury = envelopeCategories.save(EnvelopeCategory(
        ledger = ledger,
        name = "Luxury",
      ))

      val rent = envelopes.save(Envelope(
        category = housing,
        name = "Rent",
        created = null,
        lastUpdated = null,
      ))

      val utilities = envelopes.save(Envelope(
        category = housing,
        name = "Utilities",
        created = null,
        lastUpdated = null,
      ))

      val groceries = envelopes.save(Envelope(
        category = eating,
        name = "Groceries",
        created = null,
        lastUpdated = null,
      ))

      val autoGas = envelopes.save(Envelope(
        category = transportation,
        name = "Gas",
        created = null,
        lastUpdated = null,
      ))

      val autoMaint = envelopes.save(Envelope(
        category = transportation,
        name = "Car Maintenance",
        created = null,
        lastUpdated = null,
      ))

      val entertainment = envelopes.save(Envelope(
        category = luxury,
        name = "Entertainment",
        created = null,
        lastUpdated = null,
      ))

      val subscriptions = envelopes.save(Envelope(
        category = luxury,
        name = "Subscriptions",
        created = null,
        lastUpdated = null,
      ))

      val clothes = envelopes.save(Envelope(
        category = luxury,
        name = "Clothes",
        created = null,
        lastUpdated = null,
      ))
    }
  }
}
