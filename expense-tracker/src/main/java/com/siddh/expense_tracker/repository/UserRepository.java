package com.siddh.expense_tracker.repository;

import com.siddh.expense_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


//performing crud operations
public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User>findByEmail(String email);

    void deleteByEmail(String email);
}
