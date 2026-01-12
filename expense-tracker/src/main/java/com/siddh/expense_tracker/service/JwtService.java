package com.siddh.expense_tracker.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
/*
 * helps us to perform various operations with jwt like creating it, verifying it, get username from token, checking its expiry and refreshing token
 * */
@Service
public class JwtService {
	private final SecretKey key;
	private final long accessTtlSeconds;
	private final long refreshTtlSeconds;
	private final String issuer;
	public JwtService(@Value("${application.security.jwt.secret-key}") String secret,@Value("${application.security.jwt.expiration}") long accessTtlSeconds, @Value("${application.security.jwt.refresh}") long refreshTtlSeconds, @Value("${application.security.jwt.issuer}") String issuer) {
		
		if(secret==null || secret.length()<32) {
			throw new IllegalArgumentException("Invalid Secret");
		}
		
		this.key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		
		this.accessTtlSeconds = accessTtlSeconds;
		this.refreshTtlSeconds = refreshTtlSeconds;
		this.issuer = issuer;
		
	}
	
	
	//generate token
	public String generateAccessToken(String email) {
		Instant now =Instant.now();
		
		return Jwts.builder()
	            .subject(email)
	            .issuer(issuer)
	            .issuedAt(Date.from(now))
	            .expiration(Date.from(now.plusSeconds(accessTtlSeconds)))
	            .signWith(key)
	            .compact();
	}
	
	public String generateRefreshToken(String email){
	    Instant now=Instant.now();

	    return Jwts.builder()
	            .subject(email)
	            .issuer(issuer)
	            .issuedAt(Date.from(now))
	            .expiration(Date.from(now.plusSeconds(refreshTtlSeconds)))
	            .signWith(key)
	            .compact();
	}


	public String extractUsername(String token){
		 return Jwts.parser()
		         .verifyWith(key)
		         .build()
		         .parseSignedClaims(token)
		         .getPayload()
		         .getSubject();
	}
	
	public boolean isTokenExpired(String token) {
		Date expiration=Jwts.parser()
	            .verifyWith(key)
	            .build()
	            .parseSignedClaims(token)
	            .getPayload()
	            .getExpiration();

	    return expiration.before(new Date());
	}
	public boolean isTokenValid(String token,String email) {
	    String extractedEmail=extractUsername(token);
	    return extractedEmail.equals(email) && !isTokenExpired(token);
	}
}
