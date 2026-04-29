package com.siddh.expense_tracker.dto;

public class AuthResponse {
	public String accessToken;
    public UserResponse userResponse;
    public AuthResponse(String token, UserResponse userResponse){
        this.accessToken = token;
        this.userResponse=userResponse;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public UserResponse getUserResponse() {
        return userResponse;
    }
}
