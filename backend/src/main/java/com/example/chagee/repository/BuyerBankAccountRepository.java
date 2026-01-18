package com.example.chagee.repository;

import com.example.chagee.entity.BuyerBankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuyerBankAccountRepository extends JpaRepository<BuyerBankAccount, BuyerBankAccount.Id> {
}