package com.siddh.expense_tracker.security;

import java.io.IOException;import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.siddh.expense_tracker.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
	private final JwtService jwtService;
	
	private final CustomUserDetailsService customUserDetailsService;
	
	public JwtAuthFilter(JwtService jwtService, CustomUserDetailsService customUserDetailsService) {
		this.jwtService = jwtService;
		this.customUserDetailsService = customUserDetailsService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)throws ServletException, IOException{
		
		String path=request.getRequestURI();
//        System.out.println("JWT FILTER PATH = " + path);
		if (path.startsWith("/api/v1/auth") || path.startsWith("/api/v1/transaction/ai/ask")){
//            System.out.println("SKIPPING JWT FOR = " + path);
	        filterChain.doFilter(request, response);
	        return;
	    }
		
		String authHeader=request.getHeader("Authorization");
//        System.out.println("AUTH HEADER = " + authHeader);
		
		if(authHeader==null || !authHeader.startsWith("Bearer ")) {
//            System.out.println("NO VALID BEARER HEADER");
			filterChain.doFilter(request, response);
			return;
		}
		String token=authHeader.substring(7);
		String email=jwtService.extractUsername(token);
//        System.out.println("EMAIL FROM TOKEN = " + email);
		
		if(email!=null && SecurityContextHolder.getContext().getAuthentication()==null) {
			UserDetails userDetails=customUserDetailsService.loadUserByUsername(email);
//            System.out.println("USER DETAILS FOUND = " + userDetails.getUsername());
			
			if(jwtService.isTokenValid(token, userDetails.getUsername())) {
//                System.out.println("TOKEN VALID");
				UsernamePasswordAuthenticationToken authenToken=new UsernamePasswordAuthenticationToken(userDetails, null,userDetails.getAuthorities());
				
				authenToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authenToken);
			}
            else {
//                System.out.println("TOKEN INVALID");
            }
		}
//        System.out.println("AUTH IN CONTEXT = " + SecurityContextHolder.getContext().getAuthentication());
		
		filterChain.doFilter(request, response);
	}
	
	
}
