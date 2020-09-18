package com.vimofthevine.underbudget.repository

import com.vimofthevine.underbudget.model.EnvelopeCategory

import java.util.UUID

import org.springframework.data.repository.CrudRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource(path = "envelope-categories")
interface EnvelopeCategoryRepository : CrudRepository<EnvelopeCategory, UUID>
