package com.vimofthevine.underbudget.security

import io.jsonwebtoken.*

import java.util.Date
import java.util.UUID

import javax.crypto.spec.SecretKeySpec

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component

@Component
class JwtTokenProvider(
  @Value("\${app.jwt.secret}")
  private val secret: String,

  @Value("\${app.jwt.expirationMillis}")
  private val expirationMillis: Int
) {
  private val logger = LoggerFactory.getLogger(javaClass)

  private val key = SecretKeySpec(secret.toByteArray(), SignatureAlgorithm.HS512.jcaName)

  fun generateToken(userId: UUID) = Jwts.builder()
    .setSubject(userId.toString())
    .setId(UUID.randomUUID().toString())
    .setIssuedAt(Date())
    .setExpiration(Date(Date().time + expirationMillis))
    .signWith(key, SignatureAlgorithm.HS512)
    .compact()

  fun getUserIdFromToken(token: String) = UUID.fromString(
    Jwts.parser()
      .setSigningKey(key)
      .parseClaimsJws(token)
      .getBody()
      .getSubject()
  )

  fun validateToken(token: String): Boolean {
    try {
      Jwts.parser().setSigningKey(key).parseClaimsJws(token)
      return true
    } catch (exc: Exception) {
      logger.error("Invalid token: ${exc.message}")
      return false
    }
  }
}