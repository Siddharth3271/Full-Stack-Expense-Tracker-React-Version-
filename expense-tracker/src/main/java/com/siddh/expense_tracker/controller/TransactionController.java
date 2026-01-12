package com.siddh.expense_tracker.controller;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.siddh.expense_tracker.entity.Transaction;
import com.siddh.expense_tracker.service.TransactionService;

@RestController
@RequestMapping("/api/v1/transaction")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {
	private static final Logger logger=Logger.getLogger(TransactionController.class.getName());
	
	@Autowired
	private TransactionService transactionService;
	
	//getting request for recent transaction history
	@GetMapping("/recent/me")
	public ResponseEntity<List<Transaction>>getRecentTransactions(@PathVariable int userId,@RequestParam int startPage, @RequestParam int endPage, @RequestParam int size){
		logger.info("Getting transactions for userId "+userId+",Page: ("+startPage+","+endPage+")");
        List<Transaction>recentTransactionList=transactionService.getRecentTransactionsByUserId(userId,startPage,endPage,size);

        return ResponseEntity.status(HttpStatus.OK).body(recentTransactionList);
	}
	
	//getting request for transaction for a particular year
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Transaction>>getAllTransactionsByUserIdAndYearOrMonth(@PathVariable int userId, @RequestParam int year, @RequestParam(required=false)Integer month){
		logger.info("getting all transactions with userId: "+userId+" @"+year);
		
		List<Transaction>transactionList=null;
		
		if(month==null) {
			transactionList=transactionService.getAllTransactionsByUserIdAndYear(userId,year);
		}
		else {
			transactionList=transactionService.getAllTransactionsByUserIdAndYearAndMonth(userId,year,month);
		}
		
		return ResponseEntity.status(HttpStatus.OK).body(transactionList);
	}
	
	@GetMapping("/{transactionId}")
	public ResponseEntity<Transaction>getTransactionById(@PathVariable int transactionId) {

	    logger.info("Getting transaction with id " + transactionId);

	    Transaction transaction = transactionService.getTransactionById(transactionId);

	    if(transaction == null){
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }

	    return ResponseEntity.ok(transaction);
	}
	
	//getting request for distinct years
	@GetMapping("/years/{userId}")
	public ResponseEntity<List<Integer>>getDistinctTransactionYears(@PathVariable int userId){
		logger.info("Getting distinct years: "+userId);
        return ResponseEntity.status(HttpStatus.OK).body(transactionService.getDistinctTransactionYears(userId));
	}
	
	//request for creating new transaction
	 @PostMapping
	 public ResponseEntity<Transaction>createTransaction(@RequestBody Transaction transaction){
	    logger.info("Creating the transaction");
	    Transaction newTransaction=transactionService.createTransaction(transaction);
	    if(newTransaction==null){
	    	return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }
	    return ResponseEntity.status(HttpStatus.OK).body(newTransaction);
	 }
	 
	 //request for updating transaction
	 @PutMapping("/{transactionId}")
	 public ResponseEntity<Transaction>updateTransaction(@PathVariable int transactionId,@RequestBody Transaction transaction){
		logger.info("Updating transaction with id: "+transactionId);

		return ResponseEntity.ok(transactionService.updateTransaction(transactionId,transaction));
	    
    }
	 
	//request for deleting transaction
	 @DeleteMapping("/{transactionId}")
	 public ResponseEntity<Transaction>deleteTransactionById(@PathVariable int transactionId){
	    logger.info("Delete Transaction with id "+transactionId);

	    transactionService.deleteTransactionById(transactionId);
        return ResponseEntity.status(HttpStatus.OK).build();
	 }
	
}
