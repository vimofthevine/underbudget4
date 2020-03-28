package com.vimofthevine.underbudget.service

import com.nhaarman.mockitokotlin2.*
import com.vimofthevine.underbudget.dto.CreateTokenRequest
import com.vimofthevine.underbudget.model.Token
import com.vimofthevine.underbudget.repository.TokenRepository
import com.vimofthevine.underbudget.security.JwtTokenProvider

import io.jsonwebtoken.*

import java.util.UUID

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.AuthenticationException
import org.springframework.web.server.ResponseStatusException

@ExtendWith(MockitoExtension::class)
class TokenServiceTest {
  @Mock
  lateinit var authManager: AuthenticationManager

  @Mock
  lateinit var tokenProvider: JwtTokenProvider

  @Mock
  lateinit var tokenRepo: TokenRepository

  @InjectMocks
  lateinit var service: TokenService

  @Test
  fun `authentication attempt should throw when failed credentials provided`() {
    whenever(authManager.authenticate(any())).thenThrow(BadCredentialsException("bad creds"))
    assertThrows(AuthenticationException::class.java) {
      service.authenticate(CreateTokenRequest(password = "testpass", source = "test"))
    }
  }

  @Test
  fun `authentication attempt should create JWT token when successful`() {
    val jwtId = UUID.fromString("12341234-1234-1234-1234-123412341234")
    whenever(authManager.authenticate(any())).thenReturn(
      UsernamePasswordAuthenticationToken(null, null))
    whenever(tokenRepo.save(any<Token>())).thenReturn(Token(jwtId = jwtId, source = "unittest"))
    whenever(tokenProvider.generateToken(jwtId, "user")).thenReturn("jwtToken")
    val response = service.authenticate(CreateTokenRequest(password = "testpass", source = "test"))
    assertEquals("jwtToken", response.token)
  }
}