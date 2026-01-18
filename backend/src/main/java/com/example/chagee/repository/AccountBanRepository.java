package com.example.chagee.repository;

import com.example.chagee.entity.AccountBan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountBanRepository extends JpaRepository<AccountBan, AccountBan.Id> {
}