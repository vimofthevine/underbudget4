package com.vimofthevine.underbudget.config

import com.vimofthevine.underbudget.security.*

import org.springframework.beans.factory.annotation.Value
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
  private val jwtFilter: JwtAuthenticationFilter,

  @Value("\${app.user.password}")
  private val password: String
) : WebSecurityConfigurerAdapter() {

  override fun configure(builder: AuthenticationManagerBuilder) {
    builder.inMemoryAuthentication()
      .withUser("user").password(password).roles("USER")
      .and()
      .passwordEncoder(passwordEncoder())
  }

  override fun configure(http: HttpSecurity) {
    http.csrf().disable()
      .exceptionHandling()
        .authenticationEntryPoint(JwtAuthEntryPoint())
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
          "/**/*.js",
          "/**/*swagger*/**",
          "/**/*springfox*/**",
          "/v2/api-docs",
          "/api/authenticate"
        ).permitAll()
        .antMatchers(HttpMethod.GET, "/api", "/api/profile", "/api/profile/**").permitAll()
        .anyRequest().authenticated()

    http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter::class.java)
  }

  @Bean
  fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

  @Bean
  override fun authenticationManager() = super.authenticationManager()
}
