package com.vimofthevine.underbudget.repository

import com.vimofthevine.underbudget.model.Envelope

import java.util.UUID

import org.springframework.data.repository.PagingAndSortingRepository

interface EnvelopeRepository : PagingAndSortingRepository<Envelope, UUID>
