package com.siddh.expense_tracker.controller;

import com.siddh.expense_tracker.dto.AITransactionAdviceResponse;
import com.siddh.expense_tracker.entity.Transaction;
import com.siddh.expense_tracker.repository.TransactionRepository;
import com.siddh.expense_tracker.service.AIService;
import com.siddh.expense_tracker.service.TransactionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transaction/ai")
public class AITransactionController {

    private final AIService aiService;
    private final TransactionService transactionService;


    public AITransactionController(AIService aiService, TransactionService transactionService) {
        this.aiService = aiService;
        this.transactionService = transactionService;
    }

    @GetMapping("/ask")
    public String askQuestion(@RequestParam String ask){
        return aiService.returnContent(ask);
    }

    @GetMapping("/advice/recent")
    public AITransactionAdviceResponse getRecentTransactionAdvice(Authentication authentication){
        String email=authentication.getName();

        List<Transaction> transactionList=transactionService.getRecentTransactionsForUser(email,0,0,20);
        return aiService.generateStructuredTransactionAdvice(transactionList);
    }

    @GetMapping("/advice/month")
    public AITransactionAdviceResponse getMonthlyTransactionAdvice(Authentication authentication, @RequestParam int year, @RequestParam int month){
        String email=authentication.getName();

        List<Transaction> transactionList=transactionService.getTransactionsForUserByYearAndMonth(email,year,month);
        return aiService.generateStructuredTransactionAdvice(transactionList);
    }
}
