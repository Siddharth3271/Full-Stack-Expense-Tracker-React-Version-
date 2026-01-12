package com.siddh.expense_tracker.dto;

public class AuthResponse {
	public String accessToken;
    public AuthResponse(String token){
        this.accessToken = token;
    }
}
