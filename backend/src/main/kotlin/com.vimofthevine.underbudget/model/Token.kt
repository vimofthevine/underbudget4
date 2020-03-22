package com.vimofthevine.underbudget.model

import java.time.Instant
import java.util.UUID

import javax.persistence.*

@Entity
@Table(name = "user")
data class Token(
  @Id
  @GeneratedValue
  val id: UUID = UUID.randomUUID(),

  @Column(name = "jwt_id", unique = true)
  val jwtId: String,

  @Column
  val issued: Instant,

  @Column
  val source: String
)