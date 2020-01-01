package com.vimofthevine.underbudget.dto

import javax.validation.constraints.*

data class UserRegistrationRequest(
  @get:NotNull(message = "Username is required")
  @get:Size(min = 6, max = 128, message = "Username must be between 6 and 128 characters in length")
  @get:Pattern(regexp = "[a-zA-Z0-9._]+",
    message = "Username must contain only letters, numbers, dots, or underscores")
  val name: String,

  @get:NotNull(message = "Email is required")
  @get:Email
  val email: String,

  @get:NotNull(message = "Password is required")
  @get:Min(value = 12, message = "Password must be at least 12 characters in length")
  val password: String
)
