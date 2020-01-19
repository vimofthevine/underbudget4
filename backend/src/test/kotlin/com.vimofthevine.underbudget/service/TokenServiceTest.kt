package com.vimofthevine.underbudget.service

import com.nhaarman.mockitokotlin2.*
import com.vimofthevine.underbudget.dto.LoginRequest
import com.vimofthevine.underbudget.repository.TokenRepository
import com.vimofthevine.underbudget.security.JwtTokenProvider
import com.vimofthevine.underbudget.security.UserPrincipal

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
    try {
      service.authenticate(LoginRequest(name = "testuser", password = "testpass"))
      fail<Unit>("Should have thrown exception")
    } catch (e: AuthenticationException) {}
  }

  @Test
  fun `authentication attempt should throw when user principal is invalid`() {
    whenever(authManager.authenticate(any())).thenReturn(UsernamePasswordAuthenticationToken("testuser", null))
    try {
      service.authenticate(LoginRequest(name = "testuser", password = "testpass"))
      fail<Unit>("Should have thrown exception")
    } catch (e: ResponseStatusException) {
      assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, e.status)
    }
  }

  @Test
  fun `authentication attempt should create JWT token`() {
    val userId = UUID.fromString("aaaabbbb-aaaa-bbbb-cccc-aaaabbbbcccc")
    whenever(authManager.authenticate(any())).thenReturn(UsernamePasswordAuthenticationToken(
      UserPrincipal(userId, "testuser", ""), null))
    whenever(tokenProvider.generateToken(userId)).thenReturn("jwtToken")
    val response = service.authenticate(LoginRequest(name = "testuser", password = "testpass"))
    assertEquals("jwtToken", response.token)
  }
}