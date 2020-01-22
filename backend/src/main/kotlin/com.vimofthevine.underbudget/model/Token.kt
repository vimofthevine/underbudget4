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

  @ManyToOne
  @JoinColumn(name = "user_id")
  val user: User,

  @Column(name = "jwt_id", length = 256, unique = true)
  val jwtId: String,

  @Column
  val issued: Instant,

  @Column(length = 512)
  val subject: String
)