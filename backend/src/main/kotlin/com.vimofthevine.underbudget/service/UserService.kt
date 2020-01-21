package com.vimofthevine.underbudget.service

import com.vimofthevine.underbudget.dto.UserIdResponse
import com.vimofthevine.underbudget.dto.UserRegistrationRequest
import com.vimofthevine.underbudget.model.User
import com.vimofthevine.underbudget.repository.UserRepository

import java.util.UUID

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class UserService(
  private val passwords: PasswordEncoder,
  private val users: UserRepository
) {
  private val logger = LoggerFactory.getLogger(javaClass)

  fun getUserProfile(id: UUID) =
    users.findById(id).orElse(null)?.let({ it.toUserProfile() })
    ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
  
  fun registerUser(req: UserRegistrationRequest): UserIdResponse {
    if (users.findByName(req.name) != null) {
      throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is already in use")
    } else if (users.findByEmail(req.email) != null) {
      throw ResponseStatusException(HttpStatus.BAD_REQUEST,
        "User with given email address already exists")
    }
    try {
      val user = users.save(User(
        name = req.name,
        email = req.email,
        hashedPassword = passwords.encode(req.password)
      ))
      return UserIdResponse(userId = user.id)
    } catch (e: Throwable) {
      throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
        "Unable to register user", e)
    }
  }
}