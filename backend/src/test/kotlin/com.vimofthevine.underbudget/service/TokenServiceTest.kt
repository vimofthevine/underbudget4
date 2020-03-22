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

  @Mock
  lateinit var jws: Jws<Claims>

  @Test
  fun `authentication attempt should throw when failed credentials provided`() {
    whenever(authManager.authenticate(any())).thenThrow(BadCredentialsException("bad creds"))
    assertThrows(AuthenticationException::class.java) {
      service.authenticate(CreateTokenRequest(password = "testpass", source = "test"))
    }
  }

  @Test
  fun `authentication attempt should create JWT token when successful`() {
    whenever(authManager.authenticate(any())).thenReturn(
      UsernamePasswordAuthenticationToken(null, null))
    whenever(tokenProvider.generateToken("user")).thenReturn("jwtToken")
    val response = service.authenticate(CreateTokenRequest(password = "testpass", source = "test"))
    assertEquals("jwtToken", response.token)
  }

  @Test
  fun `authentication attempt should save JWT token to repo when successful`() {
    whenever(authManager.authenticate(any())).thenReturn(
      UsernamePasswordAuthenticationToken(null, null))
    whenever(tokenProvider.generateToken("user")).thenReturn("jwtToken")
    whenever(tokenProvider.parseToken("jwtToken")).thenReturn(jws)
    whenever(tokenProvider.getJwtId(jws)).thenReturn("jwtId")
    service.authenticate(CreateTokenRequest(password = "testpass", source = "test"))
    verify(tokenRepo).save(any<Token>())
  }
}