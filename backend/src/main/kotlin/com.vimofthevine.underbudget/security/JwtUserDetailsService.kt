package com.vimofthevine.underbudget.security

import com.vimofthevine.underbudget.repository.UserRepository

import java.util.UUID

import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class JwtUserDetailsService(
  val users: UserRepository
) : UserDetailsService {
  override fun loadUserByUsername(username: String) =
    users.findByName(username)?.let({ UserPrincipal(it.id, it.name, it.hashedPassword)})
    ?: throw UsernameNotFoundException(username)

  fun loadUserById(id: UUID) =
    users.findById(id).orElse(null)?.let({ UserPrincipal(it.id, it.name, it.hashedPassword)})
    ?: throw UsernameNotFoundException(id.toString())
}