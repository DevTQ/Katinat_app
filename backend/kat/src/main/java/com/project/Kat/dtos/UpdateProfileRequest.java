package com.project.Kat.dtos;

public class UpdateProfileRequest {
    private String fullname;
    private String gender;

    public String getFullname() {
        return fullname;
    }
    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
}
