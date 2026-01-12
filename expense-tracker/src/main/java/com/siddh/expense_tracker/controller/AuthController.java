package com.siddh.expense_tracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.siddh.expense_tracker.entity.User;
import com.siddh.expense_tracker.service.JwtService;
import com.siddh.expense_tracker.service.UserService;

import com.siddh.expense_tracker.dto.AuthResponse;
import com.siddh.expense_tracker.dto.SigninRequest;
import com.siddh.expense_tracker.dto.SignupRequest;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
	
	private final JwtService jwtService;
	
	private final UserService userService;
	
	public AuthController(JwtService jwtService, UserService userService) {
		this.jwtService = jwtService;
		this.userService = userService;
	}

	@PostMapping("/signup")
	public ResponseEntity<String> signUp(@RequestBody SignupRequest signupRequest) {
		
		if (userService.getUserByEmail(signupRequest.email).isPresent()){
	        return ResponseEntity.status(409).body("Email already exists");
	    }
		userService.createUser(signupRequest.name,signupRequest.email,signupRequest.password);

	    return ResponseEntity.status(201).body("User Registered");
	}
	
	@PostMapping("/signin")
	public ResponseEntity<AuthResponse> signIn(@RequestBody SigninRequest signinRequest) {
		User user=userService.authenticate(signinRequest.email, signinRequest.password);
		String token=jwtService.generateAccessToken(user.getEmail());
		return ResponseEntity.ok(new AuthResponse(token));
	}
	
}
