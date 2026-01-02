package com.siddh.expense_tracker.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.siddh.expense_tracker.entity.User;
import com.siddh.expense_tracker.repository.UserRepository;

@Service
public class UserService {
	private static final Logger logger=Logger.getLogger(UserService.class.getName());
	
	@Autowired
	private UserRepository userRepository;
	
	//getting details from user(GET)
	public Optional<User> getUserById(int userId){
        logger.info("Getting the user by id: "+userId);
        return userRepository.findById(userId);
    }

    public Optional<User>getUserByEmail(String email){
        logger.info("Getting usr by Email "+email);
        return userRepository.findByEmail(email);  //calling query
    }
    
    //saving user details to database(GET)
    public User createUser(String name,String username,String password){
        User user=new User();
        user.setName(name);
        user.setPassword(password);
        user.setEmail(username);
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }
}
