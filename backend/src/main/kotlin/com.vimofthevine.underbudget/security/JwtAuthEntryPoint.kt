package com.vimofthevine.underbudget.security

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.stereotype.Component

import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import java.io.IOException

@Component
class JwtAuthEntryPoint : AuthenticationEntryPoint {
  private val logger = LoggerFactory.getLogger(javaClass)

  override fun commence(request: HttpServletRequest,
                        response: HttpServletResponse,
                        exception: AuthenticationException) {
    logger.error("Unauthorized error: {}", exception.message);
    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, exception.message)
  }
}