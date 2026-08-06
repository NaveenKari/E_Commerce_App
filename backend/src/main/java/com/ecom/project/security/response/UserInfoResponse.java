package com.ecom.project.security.response;

import java.util.List;

public class UserInfoResponse {
    private Long id;
    private String jwt;

    private String username;
    private List<String> roles;

    public UserInfoResponse(Long id,String jwt, String username, List<String> roles) {
        this.id = id;
        this.jwt = jwt;
        this.username = username;
        this.roles = roles;
    }

    public UserInfoResponse(Long id, String username, List<String> roles) {
        this.id = id;
        this.username = username;
        this.roles = roles;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
