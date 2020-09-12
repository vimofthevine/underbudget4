package com.vimofthevine.underbudget.repository

import com.vimofthevine.underbudget.model.AccountCategory

import java.util.UUID

import org.springframework.data.repository.CrudRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource(path = "account-categories")
interface AccountCategoryRepository : CrudRepository<AccountCategory, UUID>