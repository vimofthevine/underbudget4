package com.vimofthevine.underbudget.security

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JwtAuthenticationFilter(
  private val tokens: JwtTokenProvider,
  private val users: JwtUserDetailsService
) : OncePerRequestFilter() {
  override fun doFilterInternal(request: HttpServletRequest,
      response: HttpServletResponse, chain: FilterChain) {
    try {
      getTokenFromRequest(request)?.let({
        if (StringUtils.hasText(it) and tokens.validateToken(it)) {
          val id = tokens.getUserIdFromToken(it)
          val user = users.loadUserById(id)
          val auth = UsernamePasswordAuthenticationToken(user, null, user.authorities)
          auth.setDetails(WebAuthenticationDetailsSource().buildDetails(request))

          SecurityContextHolder.getContext().setAuthentication(auth)
        }
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