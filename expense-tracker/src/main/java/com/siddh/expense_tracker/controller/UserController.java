package com.siddh.expense_tracker.controller;

import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.siddh.expense_tracker.entity.User;
import com.siddh.expense_tracker.service.UserService;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin(origins="http://localhost:3000")
public class UserController {
	private static final Logger logger=Logger.getLogger(UserController.class.getName());
	
	@Autowired
	private UserService userService;
	
	//checking existence of user
	@GetMapping
	public ResponseEntity<User>getUserByEmail(@RequestParam String email){
		logger.info("Getting User by Email "+email);
		
		Optional<User>userOptional=userService.getUserByEmail(email);
		
		if(userOptional.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		else {
			//return user object
			return ResponseEntity.status(HttpStatus.OK).body(userOptional.get());
		}
	}
	
	//login
	@PostMapping("/login")
	public ResponseEntity<User>loginUser(@RequestBody Map<String, String> loginData){
		//finding the user data that contains the given email
		
		String email = loginData.get("email");
        String password = loginData.get("password");
		
		Optional<User>userOptional=userService.getUserByEmail(email);
		
		if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
		
		User foundUser=userOptional.get();
		
		//checking match for password
        if(!password.equals(foundUser.getPassword())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(foundUser);
	}
	
	//creating new user
	@PostMapping
    public ResponseEntity<User>createUser(@RequestBody User user){
        logger.info("Creating New User");
        if (userService.getUserByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
       }
        User newUser=userService.createUser(
                user.getName(), user.getEmail(),user.getPassword()
        );

        return ResponseEntity.status(HttpStatus.OK).body(newUser);
    }
}
