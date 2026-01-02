package com.siddh.expense_tracker.repository;

import com.siddh.expense_tracker.entity.TransactionCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionCategoryRepository extends JpaRepository<TransactionCategory,Integer> {
    @Query("SELECT t FROM TransactionCategory t WHERE t.user.id = :userId")
    List<TransactionCategory> findAllByUserId(int userId);
}
