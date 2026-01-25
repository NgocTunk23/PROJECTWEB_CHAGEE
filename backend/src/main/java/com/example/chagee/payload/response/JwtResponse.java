package com.example.chagee.payload.response;

import java.util.List;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String email;
    private int rewardPoints; // <--- Thêm trường này
    private List<String> roles;

    public JwtResponse(String accessToken, String username, String email, int rewardPoints, List<String> roles) {
        this.token = accessToken;
        this.username = username;
        this.email = email;
        this.rewardPoints = rewardPoints;
        this.roles = roles;
    }

    // Getters and Setters
    public String getAccessToken() { return token; }
    public void setAccessToken(String accessToken) { this.token = accessToken; }
    public String getTokenType() { return type; }
    public void setTokenType(String tokenType) { this.type = tokenType; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public int getRewardPoints() { return rewardPoints; } // <--- Getter quan trọng
    public void setRewardPoints(int rewardPoints) { this.rewardPoints = rewardPoints; }
    public List<String> getRoles() { return roles; }
}