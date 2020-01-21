package com.vimofthevine.underbudget.service

import com.nhaarman.mockitokotlin2.*
import com.vimofthevine.underbudget.dto.UserRegistrationRequest
import com.vimofthevine.underbudget.model.User
import com.vimofthevine.underbudget.repository.UserRepository

import java.util.Date
import java.util.Optional
import java.util.UUID

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.server.ResponseStatusException

@ExtendWith(MockitoExtension::class)
class UserServiceTest {
  @Mock
  lateinit var encoder: PasswordEncoder

  @Mock
  lateinit var repo: UserRepository

  @InjectMocks
  lateinit var service: UserService

  val user = User(id = UUID.fromString("aaaabbbb-aaaa-bbbb-cccc-aaaabbbbcccc"), name = "dbuser",
    email = "user@db.com", hashedPassword = "pword",
    created = Date(2020, 1, 15), lastUpdated = Date(2020, 1, 16))

  @Test
  fun `get profile should throw when user not found`() {
    whenever(repo.findById(UUID.fromString("aabbaabb-aabb-aabb-aabb-aabbaabbaabb")))
      .thenReturn(Optional.empty())
    try {
      service.getUserProfile(UUID.fromString("aabbaabb-aabb-aabb-aabb-aabbaabbaabb"))
    } catch (e: ResponseStatusException) {
      assertEquals(HttpStatus.NOT_FOUND, e.status)
    }
  }

  fun `get profile should return user profile`() {
    whenever(repo.findById(UUID.fromString("aaaabbbb-aaaa-bbbb-cccc-aaaabbbbcccc")))
      .thenReturn(Optional.of(user))
    val profile = service.getUserProfile(UUID.fromString("aaaabbbb-aaaa-bbbb-cccc-aaaabbbbcccc"))
    assertEquals(UUID.fromString("aaaabbbb-aaaa-bbbb-cccc-aaaabbbbcccc"), profile.id)
    assertEquals("dbuser", profile.name)
    assertEquals("user@db.com", profile.email)
    assertEquals(Date(2020, 1, 15), profile.created)
    assertEquals(Date(2020, 1, 16), profile.lastUpdated)
  }

  @Test
  fun registerShouldThrowWhenDuplicateName() {
    whenever(repo.findByName("dupuser")).thenReturn(user)
    try {
      service.registerUser(UserRegistrationRequest(
        name = "dupuser",
        email = "user@test.com",
        password = "mypassword"))
      fail<Unit>("Should have thrown exception")
    } catch (e: ResponseStatusException) {
      assertEquals(HttpStatus.BAD_REQUEST, e.status)
    }
  }

  @Test
  fun registerShouldThrowWhenDuplicateEmail() {
    whenever(repo.findByName("dupuser")).thenReturn(null)
    whenever(repo.findByEmail("user@test.com")).thenReturn(user)
    try {
      service.registerUser(UserRegistrationRequest(
        name = "dupuser",
        email = "user@test.com",
        password = "mypassword"))
      fail<Unit>("Should have thrown exception")
    } catch (e: ResponseStatusException) {
      assertEquals(HttpStatus.BAD_REQUEST, e.status)
    }
  }

  @Test
  fun registerShouldThrowWhenSaveError() {
    whenever(repo.findByName("dupuser")).thenReturn(null)
    whenever(repo.findByEmail("user@test.com")).thenReturn(null)
    whenever(encoder.encode("mypassword")).thenReturn("hashed")
    whenever(repo.save(any<User>())).thenThrow(RuntimeException())
    try {
      service.registerUser(UserRegistrationRequest(
        name = "dupuser",
        email = "user@test.com",
        password = "mypassword"))
      fail<Unit>("Should have thrown exception")
    } catch (e: ResponseStatusException) {
      assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, e.status)
    }
  }

  @Test
  fun registerShouldReturnUserIdResponseWhenSuccessful() {
    whenever(repo.findByName("dupuser")).thenReturn(null)
    whenever(repo.findByEmail("user@test.com")).thenReturn(null)
    whenever(encoder.encode("mypassword")).thenReturn("hashed")
    whenever(repo.save(any<User>())).thenReturn(user)
    val res = service.registerUser(UserRegistrationRequest(
      name = "dupuser",
      email = "user@test.com",
      password = "mypassword"))
    assertEquals(UUID.fromString("aaaabbbb-aaaa-bbbb-cccc-aaaabbbbcccc"), res.userId)
  }
}