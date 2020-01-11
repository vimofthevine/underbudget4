package com.vimofthevine.underbudget.repository

import com.vimofthevine.underbudget.model.Token

import java.util.UUID

import org.springframework.data.repository.CrudRepository

interface TokenRepository : CrudRepository<Token, UUID> {
  fun findByJwtId(jwtId: String): Token?
  fun findByUserId(userId: UUID): List<Token>
  fun deleteByJwtId(jwtId: String)
}