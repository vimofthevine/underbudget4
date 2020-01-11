package com.vimofthevine.underbudget.repository

import com.vimofthevine.underbudget.model.Token
import com.vimofthevine.underbudget.model.User

import java.util.Date
import java.util.UUID

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest

@DataJpaTest
class TokenRepositoryTest {
  @Autowired
  lateinit var users: UserRepository

  @Autowired
  lateinit var tokens: TokenRepository

  private fun createUser() = users.save(User(
    name = "Test User",
    email = "user@test.com",
    hashedPassword = "password"
  ))

  @Test
  fun `findByJwtId should return token`() {
    val user = createUser()
    val id = tokens.save(Token(
      user = user,
      jwtId = "abcd1234",
      issued = Date(),
      subject = "test"
    )).id
    val token = tokens.findByJwtId("abcd1234")
    assertEquals(id, token?.id)
    assertEquals("Test User", token?.user?.name)
  }

  @Test
  fun `findByJwtId should return null when not found`() {
    assertNull(tokens.findByJwtId("doesntexist"))
  }

  @Test
  fun `findByUserId should return no tokens when none found`() { 
    val user = createUser()
    tokens.save(Token(
      user = user,
      jwtId = "abcd1234",
      issued = Date(),
      subject = "test"
    ))
    val found = tokens.findByUserId(UUID.fromString("aaaabbbb-aaaa-bbbb-cccc-aaaabbbbcccc"))
    assertEquals(0, found.size)
  }

  @Test
  fun `findByUserId should return one token`() {
    val user = createUser()
    val id = tokens.save(Token(
      user = user,
      jwtId = "abcd1234",
      issued = Date(),
      subject = "test"
    )).id
    val found = tokens.findByUserId(user.id)
    assertEquals(1, found.size)
    assertEquals(id, found[0].id)
    assertEquals("Test User", found[0].user.name)
  }

  @Test
  fun `findByUserId should return all tokens found`() {
    val user = createUser()
    tokens.save(Token(
      user = user,
      jwtId = "abcd1234",
      issued = Date(),
      subject = "test"
    ))
    tokens.save(Token(
      user = user,
      jwtId = "dcba4321",
      issued = Date(),
      subject = "test"
    ))
    val found = tokens.findByUserId(user.id)
    assertEquals(2, found.size)
    found.forEach({
      assertEquals("Test User", it.user.name)
    })
  }

  @Test
  fun `deleteByJwtId should delete token`() {
    val user = createUser()
    val id = tokens.save(Token(
      user = user,
      jwtId = "abcd1234",
      issued = Date(),
      subject = "test"
    )).id
    tokens.deleteByJwtId("abcd1234")
    assertFalse(tokens.findById(id).isPresent)
  }
}