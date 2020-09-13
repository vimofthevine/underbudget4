package com.vimofthevine.underbudget.model

import java.util.UUID

import javax.persistence.*
import javax.validation.constraints.*

import org.springframework.data.rest.core.config.Projection

@Entity
@Table(name = "envelope_category")
data class EnvelopeCategory(
  @Id
  val id: UUID = UUID.randomUUID(),

  @ManyToOne
  @JoinColumn(name = "ledger_id", nullable = false)
  @get:NotNull(message = "Ledger is required")
  var ledger: Ledger? = null,

  @get:NotEmpty(message = "Name is required")
  var name: String?,

  @OneToMany(mappedBy = "category", cascade = [CascadeType.REMOVE])
  var envelopes: List<Envelope>? = null,
)

@Projection(name = "categoryWithEnvelopes", types = [EnvelopeCategory::class])
interface CategoryWithEnvelopes {
  fun getId(): UUID
  fun getName(): String
  fun getEnvelopes(): List<EnvelopeOverview>
}
