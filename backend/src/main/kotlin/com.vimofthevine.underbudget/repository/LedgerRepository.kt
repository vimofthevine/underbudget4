package com.vimofthevine.underbudget.repository

import com.vimofthevine.underbudget.model.Ledger

import java.util.UUID

import org.springframework.data.repository.PagingAndSortingRepository

interface LedgerRepository : PagingAndSortingRepository<Ledger, UUID>