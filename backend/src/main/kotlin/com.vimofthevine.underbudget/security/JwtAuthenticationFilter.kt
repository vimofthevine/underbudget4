package com.vimofthevine.underbudget.security

import com.vimofthevine.underbudget.repository.TokenRepository

import io.jsonwebtoken.*

import java.util.UUID

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
class JwtAuthenticationFilter(
  private val tokenRepo: TokenRepository,
  private val tokenUtil: JwtTokenProvider
) : OncePerRequestFilter() {

  override fun doFilterInternal(request: HttpServletRequest,
      response: HttpServletResponse, chain: FilterChain) {
    try {
      getTokenFromRequest(request)?.let({
        tokenUtil.parseToken(it)?.let({
          if (tokenRepo.existsById(UUID.fromString(tokenUtil.getJwtId(it)))) {
            val auth = UsernamePasswordAuthenticationToken(
              tokenUtil.getSubject(it), null, listOf<GrantedAuthority>())
            auth.setDetails(WebAuthenticationDetailsSource().buildDetails(request))
            SecurityContextHolder.getContext().setAuthentication(auth)
          }
        })
      })
    } catch (exc: Exception) {
      logger.error("Could not set user authentication context", exc)
    }

    chain.doFilter(request, response)
  }

  private fun getTokenFromRequest(request: HttpServletRequest): String? =
    request.getHeader("Authorization")?.let({
      if (StringUtils.hasText(it) and it.startsWith("Bearer ")) {
        return it.substring(7, it.length)
      }
      return null
    })
}