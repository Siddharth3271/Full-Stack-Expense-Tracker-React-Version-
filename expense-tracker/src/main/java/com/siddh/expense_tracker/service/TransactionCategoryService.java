package com.siddh.expense_tracker.service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.siddh.expense_tracker.entity.TransactionCategory;
import com.siddh.expense_tracker.entity.User;
import com.siddh.expense_tracker.repository.TransactionCategoryRepository;
import com.siddh.expense_tracker.repository.UserRepository;

@Service
public class TransactionCategoryService {
	private static final Logger logger=Logger.getLogger(TransactionCategoryService.class.getName());
	
	@Autowired
	private  UserRepository userRepository;
	
	@Autowired
	private TransactionCategoryRepository transactionCategoryRepository;
	
	//getting category by user(GET)
	public Optional<TransactionCategory>getTransactionCategoryById(int id){
        logger.info("Getting Transaction Category by ID :"+id);
        return transactionCategoryRepository.findById(id);
    }
	
	//getting all categories(GET)
	public List<TransactionCategory>getAllTransactionCategoriesByUserId(int userId){
        logger.info("Getting all transaction Categories from user: "+userId);
        return transactionCategoryRepository.findAllByUserId(userId);
    }
	
	//creating a category(POST)
	public TransactionCategory createTransactionCategory(int userId,String categoryName,String categoryColor) {
		logger.info("Create transaction category with user: "+userId);
		
		//find the user by its id
		Optional<User>userOptional=userRepository.findById(userId);
		
		if(userOptional.isEmpty()) return null;
		
		TransactionCategory transactionCategory=new TransactionCategory();
		transactionCategory.setUser(userOptional.get());
		transactionCategory.setCategoryName(categoryName);
		transactionCategory.setCategoryColor(categoryColor);
		
		return transactionCategoryRepository.save(transactionCategory);
	}
	
	//Update a Category(PUT)
	public TransactionCategory updateTransactionCategoryById(int transactionCategoryId, String newCategoryName, String newCategoryColor) {
		
		logger.info("Updating Transaction Category with ID :"+transactionCategoryId);
		Optional<TransactionCategory>transactionCategoryOptional=transactionCategoryRepository.findById(transactionCategoryId);
		
		if(transactionCategoryOptional.isEmpty()) {
			return null;
		}
		
		TransactionCategory updatedTransactionCategory=transactionCategoryOptional.get();
        updatedTransactionCategory.setCategoryName(newCategoryName);
        updatedTransactionCategory.setCategoryColor(newCategoryColor);

        return transactionCategoryRepository.save(updatedTransactionCategory);
		
	}
	
	//delete category(DELETE)
	public boolean deleteTransactionCategoryById(int transactionCategoryById){
        logger.info("Deleting transaction Category: "+transactionCategoryById);

        Optional<TransactionCategory>transactionCategoryOptional=transactionCategoryRepository.findById(transactionCategoryById);

        if(transactionCategoryOptional.isEmpty()){
            return false;
        }

        transactionCategoryRepository.delete(transactionCategoryOptional.get());
        return true;
    }
	
}
