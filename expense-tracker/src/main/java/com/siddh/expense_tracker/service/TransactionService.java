package com.siddh.expense_tracker.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.siddh.expense_tracker.entity.Transaction;
import com.siddh.expense_tracker.entity.TransactionCategory;
import com.siddh.expense_tracker.entity.User;
import com.siddh.expense_tracker.repository.TransactionCategoryRepository;
import com.siddh.expense_tracker.repository.TransactionRepository;
import com.siddh.expense_tracker.repository.UserRepository;

@Service
public class TransactionService {
	private static final Logger logger=Logger.getLogger(TransactionService.class.getName());
	
	@Autowired
	private TransactionRepository transactionRepository;
	
	@Autowired
	private TransactionCategoryRepository transactionCategoryRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	//getting recent transactions(GET)
	public List<Transaction>getRecentTransactionsByUserId(int userId,int startPage,int endPage,int size){
		logger.info("Getting the most recent Transactions for user "+userId);
		
		List<Transaction> combinedResults=new ArrayList<>();
		
		for(int page=startPage;page<=endPage;page++) {
			Pageable pageable=PageRequest.of(page,size);
			
			List<Transaction>pageResultsList=transactionRepository.findAllByUserIdOrderByTransactionDateDesc(userId, pageable);
			combinedResults.addAll(pageResultsList);
		}
		return combinedResults;
	}
	
	//getting transactions per year(GET)
	public List<Transaction>getAllTransactionsByUserIdAndYear(int userId,int year){
		logger.info("Getting all transaction in year: "+year+" for user: "+userId);
		LocalDate startDate=LocalDate.of(year, 1, 1);
		LocalDate endDate=LocalDate.of(year, 12, 31);
		
		return transactionRepository.findAllByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(userId, startDate, endDate);
	}
	
	//getting transactions per year(GET)
	public List<Transaction>getAllTransactionsByUserIdAndYearAndMonth(int userId,int year,int month){
        logger.info("Getting all transaction in month: "+month+" and year: "+year+" for user: "+userId);
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate=LocalDate.of(year,month,1);
        LocalDate endDate=yearMonth.atEndOfMonth();

        return transactionRepository.findAllByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
                userId,startDate,endDate
        );
    }
	
	//getting transaction active years(GET)
	public List<Integer>getDistinctTransactionYears(int userId){
        return transactionRepository.findDistinctYears(userId);
    }
	
	//create a user transaction(POST)
	public Transaction createTransaction(Transaction transaction) {
		logger.info("Creating Transaction");
		
		//find category
		Optional<TransactionCategory>transactionCategoryOptional=Optional.empty();
		if(transaction.getTransactionCategory()!=null) {
			logger.info(String.valueOf(transaction.getTransactionCategory().getId()));
			transactionCategoryOptional=transactionCategoryRepository.findById(transaction.getTransactionCategory().getId());
		}
		
		//find user
		User user=userRepository.findById(transaction.getUser().getId())
				.orElseThrow(() -> new RuntimeException("User not found!"));
		
		//create a new transaction object
		Transaction newTransaction=new Transaction();
		newTransaction.setTransactionCategory(transactionCategoryOptional.isEmpty()?null:transactionCategoryOptional.get());
		newTransaction.setUser(user);
		newTransaction.setTransactionName(transaction.getTransactionName());
		newTransaction.setTransactionAmount(transaction.getTransactionAmount());
		newTransaction.setTransactionDate(transaction.getTransactionDate());
		newTransaction.setTransactionType(transaction.getTransactionType());
		
		return transactionRepository.save(newTransaction);
	}
	
	//getting transaction by id
	public Transaction getTransactionById(int transactionId) {
	    logger.info("Fetching transaction with id: "+transactionId);

	    return transactionRepository.findById(transactionId).orElse(null);
	}
	
	//updating transaction(PUT)
	public Transaction updateTransaction(int transactionId,Transaction incoming){
        logger.info("Updating transaction with id: "+transactionId);
        Transaction existing = transactionRepository.findById(transactionId)
                .orElseThrow(()->new RuntimeException("Transaction not found"));


        //Security: ownership check
        if(!existing.getUser().getId().equals(incoming.getUser().getId())){
            throw new RuntimeException("Unauthorized update");
        }

        //Update allowed fields
        existing.setTransactionName(incoming.getTransactionName());
        existing.setTransactionAmount(incoming.getTransactionAmount());
        existing.setTransactionDate(incoming.getTransactionDate());
        existing.setTransactionType(incoming.getTransactionType());

        //Validate category
        if(incoming.getTransactionCategory()!=null) {
            TransactionCategory category=transactionCategoryRepository
                    .findById(incoming.getTransactionCategory().getId())
                    .orElseThrow(()->new RuntimeException("Category not found"));

            existing.setTransactionCategory(category);
        }

        return transactionRepository.save(existing);
	}
	
	//delete transaction(DELETE)
    public void deleteTransactionById(int transactionId){
        logger.info("Deleting Transaction with id "+transactionId);
        Optional<Transaction>transactionOptional=transactionRepository.findById(transactionId);

        if(transactionOptional.isEmpty()) return;

        transactionRepository.delete(transactionOptional.get());
    }
}
