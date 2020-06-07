package com.vimofthevine.underbudget.repository

import com.vimofthevine.underbudget.model.Account

import java.util.UUID

import org.springframework.data.repository.PagingAndSortingRepository

interface AccountRepository : PagingAndSortingRepository<Account, UUID>