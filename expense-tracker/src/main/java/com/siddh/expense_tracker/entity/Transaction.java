package com.siddh.expense_tracker.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="transaction")
public class Transaction {
	@Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="category_id")
    private TransactionCategory transactionCategory;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @Column(name="transaction_name")
    private String transactionName;

    @Column(name="transaction_amount")
    private double transactionAmount;

    @Column(name="transaction_date")
    private LocalDate transactionDate;

    @Column(name="transaction_type")
    private String transactionType;
}
