package com.vimofthevine.underbudget.model

import com.vimofthevine.underbudget.dto.UserProfileResponse

import java.time.Instant
import java.util.UUID

import javax.persistence.*

@Entity
@Table(name = "user")
data class User(
  @Id
  @GeneratedValue
  val id: UUID = UUID.randomUUID(),

  @Column(length = 128, unique = true)
  val name: String,

  @Column(length = 256, unique = true)
  val email: String,

  @Column(name = "password", length = 256)
  val hashedPassword: String,

  @Column
  val verified: Boolean = false,

  @Column
  val created: Instant = Instant.now(),

  @Column(name = "last_updated")
  val lastUpdated: Instant = Instant.now()
) {
  fun toUserProfile() = UserProfileResponse(
    id = id,
    name = name,
    email = email,
    created = created,
    lastUpdated = lastUpdated
  )
}