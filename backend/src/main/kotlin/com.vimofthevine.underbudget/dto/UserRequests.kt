package com.vimofthevine.underbudget.dto

import javax.validation.constraints.*

data class LoginRequest(
  @get:NotEmpty(message = "Username is required")
  val name: String = "",

  @get:NotEmpty(message = "Password is required")
  val password: String = ""
)

data class UserRegistrationRequest(
  @get:Size(min = 6, max = 128, message = "Username must be between 6 and 128 characters in length")
  @get:Pattern(regexp = "[a-zA-Z0-9._]+",
    message = "Username must contain only letters, numbers, dots, or underscores")
  val name: String = "",

  @get:NotEmpty(message = "Email is required")
  @get:Email
  val email: String = "",

  @get:Size(min = 12, message = "Password must be at least 12 characters in length")
  val password: String = ""
)
