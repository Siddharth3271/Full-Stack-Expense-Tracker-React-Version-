package com.siddh.expense_tracker.controller;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.siddh.expense_tracker.entity.TransactionCategory;
import com.siddh.expense_tracker.service.TransactionCategoryService;

@RestController
@RequestMapping("/api/v1/transaction-category")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionCategoryController {
	private static final Logger logger=Logger.getLogger(TransactionCategoryController.class.getName());
	
	@Autowired
	TransactionCategoryService transactionCategoryService;
	
	//getting request to show all categories
	@GetMapping("/me")
	public ResponseEntity<List<TransactionCategory>>getAllTransactionCategories(){
		String email = SecurityContextHolder
		        .getContext()
		        .getAuthentication()
		        .getName();
		logger.info("Getting all transaction categories from user: "+email);
		List<TransactionCategory>transactionCategories=transactionCategoryService.getTransactionCategoriesForUser(email);
		
		return ResponseEntity.status(HttpStatus.OK).body(transactionCategories);
	}
	
	//getting single category by userId
	@GetMapping("/{id}")
    public ResponseEntity<TransactionCategory>getTransactionCategoryByIdandEmail(@PathVariable int id){
		String email=SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        logger.info("Getting Transaction Category by id: "+id);

        TransactionCategory category=transactionCategoryService.getCategoryByIdForUser(id,email);
        if(category==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(category);
    }
	
	//request for creating transaction category
	@PostMapping
	public ResponseEntity<TransactionCategory>createTransactionCategory(@RequestBody TransactionCategory transactionCategory){
		String email=SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
		logger.info("Create Transaction Category for: "+email);
		
		TransactionCategory createdCategory=transactionCategoryService.createTransactionCategory(email, transactionCategory.getCategoryName(), transactionCategory.getCategoryColor());
		return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
	}
	
	//request for updating transaction category
	@PutMapping("/{id}")
	public ResponseEntity<TransactionCategory>updateTransactionCategoryByEmail(@PathVariable int id, @RequestBody Map<String, String>body){
		String email=SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
		
		String newName=body.get("categoryName");
        String newColor=body.get("categoryColor");
		
		logger.info("Updating transaction category by email "+email);
		
		TransactionCategory updatedTransactionCategory=transactionCategoryService.updateTransactionCategory(id, email,newName, newColor);
		
		if(updatedTransactionCategory==null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		
		return ResponseEntity.status(HttpStatus.OK).body(updatedTransactionCategory);
	}
	
	//request for deleting transaction category
	@DeleteMapping("/{id}")
    public ResponseEntity<?>deleteTransactionalCategory(@PathVariable int id){
		String email=SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        logger.info("Deleting transaction category for "+email);
        
        try {
	        	transactionCategoryService.deleteTransactionCategory(id,email);
	        	return ResponseEntity.ok().build();
        }
        catch(DataIntegrityViolationException ex) {
        		return ResponseEntity.status(HttpStatus.CONFLICT).body("Cannot delete: This category is currently in use by transactions.");
        }
        catch(Exception e) {
        		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the category.");
        }
    }
	
}
