package com.vimofthevine.underbudget.dto

import java.util.Date
import java.util.UUID

data class TokenResponse(val token: String)

data class UserIdResponse(val userId: UUID)

data class UserProfileResponse(
  val id: UUID,
  val name: String,
  val email: String,
  val created: Date,
  val lastUpdated: Date
)

