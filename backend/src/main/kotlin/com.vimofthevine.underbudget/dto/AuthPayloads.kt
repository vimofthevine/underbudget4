package com.vimofthevine.underbudget.dto

import javax.validation.constraints.*

data class CreateTokenRequest(
  @get:NotEmpty(message = "Password is required")
  val password: String = "",

  @get:NotEmpty(message = "Source is required")
  val source: String = ""
)

data class TokenResponse(val token: String)
