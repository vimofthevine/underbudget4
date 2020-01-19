package com.vimofthevine.underbudget.config

import com.vimofthevine.underbudget.security.*

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class WebSecurityConfig(
  private val entryPoint: JwtAuthEntryPoint,
  private val tokenProvider: JwtTokenProvider,
  private val userDetailsService: JwtUserDetailsService
) : WebSecurityConfigurerAdapter() {
  override fun configure(builder: AuthenticationManagerBuilder) {
    builder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder())
  }

  override fun configure(http: HttpSecurity) {
    http.csrf().disable()
      .exceptionHandling()
        .authenticationEntryPoint(entryPoint)
        .and()
      .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
      .authorizeRequests()
        .antMatchers("/",
          "/favicon.ico",
          "/**/*.png",
          "/**/*.gif",
          "/**/*.svg",
          "/**/*.jpg",
          "/**/*.html",
          "/**/*.css",
          "/**/*.js"
        ).permitAll()
        .antMatchers(HttpMethod.POST, "/api/tokens", "/api/users").permitAll()
        .anyRequest().authenticated()

    http.addFilterBefore(JwtAuthenticationFilter(tokenProvider, userDetailsService),
      UsernamePasswordAuthenticationFilter::class.java)
  }

  @Bean
  fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

  @Bean
  override fun authenticationManager() = super.authenticationManager()
}
