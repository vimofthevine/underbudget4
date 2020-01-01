package com.vimofthevine.underbudget

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EnableJpaRepositories
class UnderbudgetApplication

fun main(args: Array<String>) {
	runApplication<UnderbudgetApplication>(*args)
}
