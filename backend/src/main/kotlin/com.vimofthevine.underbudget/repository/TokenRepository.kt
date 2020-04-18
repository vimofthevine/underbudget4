package com.vimofthevine.underbudget.repository

import com.vimofthevine.underbudget.model.Token

import java.util.UUID

import org.springframework.data.repository.Repository
import org.springframework.data.rest.core.annotation.RestResource

interface TokenRepository : Repository<Token, UUID> {
  fun deleteById(id: UUID)
  fun existsById(id: UUID): Boolean
  fun findAll(): List<Token>

  @RestResource(exported = false)
  fun findById(id: UUID): Token?

  @RestResource(exported = false)
  fun save(token: Token): Token
}