package com.vimofthevine.underbudget.service

import com.vimofthevine.underbudget.dto.LoginRequest
import com.vimofthevine.underbudget.dto.TokenResponse
import com.vimofthevine.underbudget.model.Token
import com.vimofthevine.underbudget.repository.TokenRepository
import com.vimofthevine.underbudget.repository.UserRepository
import com.vimofthevine.underbudget.security.JwtTokenProvider
import com.vimofthevine.underbudget.security.UserPrincipal

import org.slf4j.LoggerFactory

import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class TokenService(
  private val authManager: AuthenticationManager,
  private val tokenProvider: JwtTokenProvider,
  private val tokens: TokenRepository
) {
  private val logger = LoggerFactory.getLogger(javaClass)

  fun authenticate(req: LoginRequest): TokenResponse {
    try {
      val auth = authManager.authenticate(
        UsernamePasswordAuthenticationToken(req.name, req.password))
      SecurityContextHolder.getContext().setAuthentication(auth)
      val principal = auth.principal
      if (principal is UserPrincipal) {
        return TokenResponse(token = tokenProvider.generateToken(principal.id))
      } else {
        throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User not found")
      }
    } catch (exc: Exception) {
      logger.info("Failed auth attempt: ${exc.message}")
      throw exc
    }
  }
}