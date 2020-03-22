package com.vimofthevine.underbudget.repository

import com.vimofthevine.underbudget.model.Token

import java.util.UUID

import org.springframework.data.repository.CrudRepository

interface TokenRepository : CrudRepository<Token, UUID> {
  fun deleteByJwtId(jwtId: String)
  fun existsByJwtId(jwtId: String): Boolean
  fun findByJwtId(jwtId: String): Token?
}