package com.vimofthevine.underbudget.controller

import com.vimofthevine.underbudget.dto.*
import com.vimofthevine.underbudget.service.TokenService

import javax.validation.Valid

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
class AuthController(
  private val tokens: TokenService
) {
  @PostMapping("/api/authenticate")
  @ResponseStatus(HttpStatus.CREATED)
  fun login(@Valid @RequestBody req: CreateTokenRequest) = tokens.authenticate(req)
}
