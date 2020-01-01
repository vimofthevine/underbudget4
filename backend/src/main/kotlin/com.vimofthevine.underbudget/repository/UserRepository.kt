package com.vimofthevine.underbudget.repository

import com.vimofthevine.underbudget.model.User

import java.util.UUID

import org.springframework.data.repository.CrudRepository

interface UserRepository : CrudRepository<User, UUID> {
  fun findByName(name: String): User?
  fun findByEmail(email: String): User?
}
