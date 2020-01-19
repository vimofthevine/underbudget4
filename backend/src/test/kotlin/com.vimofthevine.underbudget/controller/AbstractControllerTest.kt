package com.vimofthevine.underbudget.controller

import com.vimofthevine.underbudget.security.JwtAuthEntryPoint
import com.vimofthevine.underbudget.security.JwtTokenProvider
import com.vimofthevine.underbudget.security.JwtUserDetailsService

import org.springframework.boot.test.mock.mockito.MockBean

abstract class AbstractControllerTest {
  @MockBean
  lateinit var jwtAuthEntryPoint: JwtAuthEntryPoint

  @MockBean
  lateinit var jwtTokenProvider: JwtTokenProvider

  @MockBean
  lateinit var jwtUserDetailsService: JwtUserDetailsService
}