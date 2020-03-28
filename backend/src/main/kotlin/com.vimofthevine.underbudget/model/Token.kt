package com.vimofthevine.underbudget.model

import java.time.Instant
import java.util.UUID

import javax.persistence.*

@Entity
@Table(name = "token")
data class Token(
  @Id
  @Column(name = "jwt_id")
  val jwtId: UUID = UUID.randomUUID(),

  @Column(nullable = false)
  val issued: Instant = Instant.now(),

  @Column(nullable = false)
  val source: String
)