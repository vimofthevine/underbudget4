package com.vimofthevine.underbudget.controller

import com.vimofthevine.underbudget.dto.UserRegistrationRequest
import com.vimofthevine.underbudget.service.UserService

import javax.validation.Valid

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController(
  private val users: UserService
) {
  @PostMapping()
  fun registerUser(@Valid @RequestBody req: UserRegistrationRequest) = users.registerUser(req)
}
