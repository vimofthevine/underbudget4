package com.vimofthevine.underbudget.model

import java.time.Instant
import java.util.UUID

import javax.persistence.*
import javax.validation.constraints.*

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "ledger")
data class Ledger(
  @Id
  val id: UUID = UUID.randomUUID(),

  @get:NotEmpty(message = "Name is required")
  var name: String?,

  @get:Min(value = 1, message = "Currency code must be a positive number")
  @get:NotNull(message = "Currency is required")
  var currency: Int?,

  @Column(updatable = false)
  @CreatedDate
  var created: Instant?,

  @Column(name = "last_updated")
  @LastModifiedDate
  var lastUpdated: Instant?,

  @OneToMany(mappedBy = "ledger", cascade = [CascadeType.REMOVE])
  var accountCategories: List<AccountCategory>? = null,

  @OneToMany(mappedBy = "ledger", cascade = [CascadeType.REMOVE])
  var envelopeCategories: List<EnvelopeCategory>? = null,
)