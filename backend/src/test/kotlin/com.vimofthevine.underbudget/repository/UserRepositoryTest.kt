package com.vimofthevine.underbudget.repository

import com.vimofthevine.underbudget.model.User

import java.util.UUID

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest

@DataJpaTest
class UserRepositoryTest {
  @Autowired
  lateinit var repo: UserRepository

  @Test
  fun shouldFindByIdWhenUserExists() {
    val id = repo.save(User(
      name = "Test User",
      email = "user@test.com",
      hashedPassword = "password"
    )).id
    val user = repo.findById(id)
    assertTrue(user.isPresent)
    assertEquals("Test User", user.get().name)
    assertEquals("user@test.com", user.get().email)
  }

  @Test
  fun shouldNotFindByIdWhenUserDoesNotExist() {
    assertFalse(repo.findById(UUID.randomUUID()).isPresent)
  }

  @Test
  fun shouldFindByNameWhenUserExists() {
    repo.save(User(
      name = "Test User",
      email = "user@test.com",
      hashedPassword = "password"
    ))
    val user = repo.findByName("Test User")
    assertEquals("Test User", user?.name)
    assertEquals("user@test.com", user?.email)
  }

  @Test
  fun shouldNotFindByNameWhenUserDoesNotExist() {
    assertNull(repo.findByName("Test User"))
  }

  @Test
  fun shouldFindByEmailWhenUserExists() {
    repo.save(User(
      name = "Test User",
      email = "user@test.com",
      hashedPassword = "password"
    ))
    val user = repo.findByEmail("user@test.com")
    assertEquals("Test User", user?.name)
    assertEquals("user@test.com", user?.email)
  }

  @Test
  fun shouldNotFindByEmailWhenUserDoesNotExist() {
    assertNull(repo.findByEmail("user@test.com"))
  }
}