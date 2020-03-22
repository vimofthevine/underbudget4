package com.vimofthevine.underbudget.dto

data class ErrorResponse(
  val message: String,
  val details: List<String>? = null
)