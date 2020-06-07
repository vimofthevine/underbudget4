package com.vimofthevine.underbudget.model

import java.time.Instant
import java.util.UUID

import javax.persistence.*
import javax.validation.constraints.*

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.rest.core.config.Projection
import org.springframework.stereotype.Component
import org.springframework.validation.Errors
import org.springframework.validation.Validator

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "account")
data class Account(
  @Id
  val id: UUID = UUID.randomUUID(),

  @ManyToOne
  @JoinColumn(name = "parent_id")
  var parent: Account? = null,

  @ManyToOne
  @JoinColumn(name = "ledger_id", nullable = false)
  @get:NotNull(message = "Ledger is required")
  var ledger: Ledger? = null,

  @get:NotEmpty(message = "Name is required")
  var name: String?,

  @get:NotNull(message = "Institution cannot be null")
  var institution: String? = "",

  @Column(name = "account_number")
  @get:NotNull(message = "Account number cannot be null")
  var accountNumber: String? = "",

  @get:NotNull(message = "Archived cannot be null")
  var archived: Boolean? = false,

  @Column(name = "external_id")
  @get:NotNull(message = "External ID cannot be null")
  var externalId: String? = "",

  @Column(updatable = false)
  @CreatedDate
  var created: Instant?,

  @Column(name = "last_updated")
  @LastModifiedDate
  var lastUpdated: Instant?
)

@Component("beforeCreateAccountValidator")
class AccountValidator: Validator {
  override fun supports(clazz: Class<*>) = Account::class.java.isAssignableFrom(clazz)

  override fun validate(target: Any, errors: Errors) {
    if (target is Account) {
      val parent = target.parent
      if (parent is Account) {
        if (parent.ledger != target.ledger) {
          errors.rejectValue("ledger", "ledger.mismatch",
            "Ledger in target does not match ledger in parent")
        }
      }
    }
  }
}

@Projection(name = "accountTreeNode", types = arrayOf(Account::class))
interface AccountTreeNode {
  fun getId(): UUID
  fun getName(): String
  fun isArchived(): Boolean

  @Value("#{target.parent?.id}")
  fun getParentId(): UUID
}