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

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "account")
data class Account(
  @Id
  val id: UUID = UUID.randomUUID(),

  @ManyToOne
  @JoinColumn(name = "category_id", nullable = false)
  @get:NotNull(message = "Category is required")
  var category: AccountCategory? = null,

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

@Projection(name = "accountOverview", types = arrayOf(Account::class))
interface AccountOverview {
  fun getId(): UUID
  fun getName(): String
  fun isArchived(): Boolean
}