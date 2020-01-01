package com.vimofthevine.underbudget.dto

import java.util.UUID

data class ErrorResponse(val message: String, val details: List<String>? = null)

data class UserIdResponse(val userId: UUID)
