package com.vimofthevine.underbudget.exception

import com.vimofthevine.underbudget.dto.ErrorResponse

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class ValidationExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException::class)
  fun handleValidationError(exc: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
    val details = exc.bindingResult.allErrors.map { it.defaultMessage }.filterNotNull()
    return ResponseEntity.badRequest().body(ErrorResponse("Validation Failed", details))
  }
}
