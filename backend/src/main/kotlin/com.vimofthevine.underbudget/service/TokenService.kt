package com.vimofthevine.underbudget.service

import com.vimofthevine.underbudget.dto.CreateTokenRequest
import com.vimofthevine.underbudget.dto.TokenResponse
import com.vimofthevine.underbudget.model.Token
import com.vimofthevine.underbudget.repository.TokenRepository
import com.vimofthevine.underbudget.security.JwtTokenProvider

import java.time.Instant

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
  private val tokenRepo: TokenRepository
) {
  private val logger = LoggerFactory.getLogger(javaClass)

  fun authenticate(req: CreateTokenRequest): TokenResponse {
    try {
      val auth = authManager.authenticate(
        UsernamePasswordAuthenticationToken("user", req.password))
      SecurityContextHolder.getContext().setAuthentication(auth)
      val token = tokenProvider.generateToken("user")
      tokenProvider.parseToken(token)?.let({
        tokenRepo.save(Token(
          jwtId = tokenProvider.getJwtId(it),
          issued = Instant.now(),
          source = req.source
        ))
      })
      return TokenResponse(token)
    } catch (exc: Exception) {
      logger.info("Failed auth attempt: ${exc.message}")
      throw exc
    }
  }
}