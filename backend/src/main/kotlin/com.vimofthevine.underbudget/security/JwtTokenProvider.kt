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

  fun generateToken(username: String) = Jwts.builder()
    .setSubject(username)
    .setId(UUID.randomUUID().toString())
    .setIssuedAt(Date())
    .setExpiration(Date(Date().time + expirationMillis))
    .signWith(key, SignatureAlgorithm.HS512)
    .compact()

  fun parseToken(token: String): Jws<Claims>? {
    try {
      return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token)
    } catch (exc: Exception) {
      logger.error("Invalid token: {}", exc.message)
      return null
    }
  }

  fun getJwtId(jws: Jws<Claims>) = jws.getBody().getId()

  fun getSubject(jws: Jws<Claims>) = jws.getBody().getSubject()
}