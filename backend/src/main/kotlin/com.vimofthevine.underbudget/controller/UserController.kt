package com.vimofthevine.underbudget.controller

import com.vimofthevine.underbudget.dto.UserRegistrationRequest
import com.vimofthevine.underbudget.service.UserService

import javax.validation.Valid

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
  private val users: UserService
) {
  @PostMapping()
  @ResponseStatus(HttpStatus.CREATED)
  fun registerUser(@Valid @RequestBody req: UserRegistrationRequest) = users.registerUser(req)
}
