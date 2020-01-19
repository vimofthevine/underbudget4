package com.vimofthevine.underbudget.controller

import com.vimofthevine.underbudget.dto.*
import com.vimofthevine.underbudget.service.TokenService

import javax.validation.Valid

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/tokens")
class TokenController(
  private val tokens: TokenService
) {
  @PostMapping()
  fun login(@Valid @RequestBody req: LoginRequest) = tokens.authenticate(req)
}
