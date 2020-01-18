package com.vimofthevine.underbudget.security

import com.vimofthevine.underbudget.model.User
import com.fasterxml.jackson.annotation.JsonIgnore

import java.util.UUID

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class UserPrincipal(
  val id: UUID,
  private val name: String,
  private val hashedPassword: String
) : UserDetails {
  override fun getAuthorities() = listOf<GrantedAuthority>()
  override fun getPassword() = hashedPassword
  override fun getUsername() = name
  override fun isAccountNonExpired() = true
  override fun isAccountNonLocked() = true
  override fun isCredentialsNonExpired() = true
  override fun isEnabled() = true
}