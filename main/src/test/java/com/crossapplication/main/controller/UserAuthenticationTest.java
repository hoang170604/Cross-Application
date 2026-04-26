package com.crossapplication.main.controller;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;

import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class UserAuthenticationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepositoryInterface userRepo;

    @BeforeEach
    public void setUp() {
        // Clean database before each test
        userRepo.deleteAll();
    }

    @Test
    public void testUserRegistration_Success() throws Exception {
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("email", "testuser@example.com");
        registerRequest.put("password", "password123");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.email").value("testuser@example.com"))
                .andExpect(jsonPath("$.data.userId").isNumber())
                .andExpect(jsonPath("$.data.expiresIn").value(86400))
                .andExpect(jsonPath("$.message").value("Registration successful"));
    }

    @Test
    public void testUserRegistration_MissingEmail() throws Exception {
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("password", "password123");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email and password are required"));
    }

    @Test
    public void testUserRegistration_MissingPassword() throws Exception {
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("email", "testuser@example.com");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email and password are required"));
    }

    @Test
    public void testUserRegistration_PasswordTooShort() throws Exception {
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("email", "testuser@example.com");
        registerRequest.put("password", "short");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    public void testUserRegistration_DuplicateEmail() throws Exception {
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("email", "duplicate@example.com");
        registerRequest.put("password", "password123");

        // First registration should succeed
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Second registration with same email should fail
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email already registered"));
    }

    @Test
    public void testUserLogin_Success() throws Exception {
        // First register a user
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("email", "logintest@example.com");
        registerRequest.put("password", "password123");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Then try to login
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "logintest@example.com");
        loginRequest.put("password", "password123");

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.email").value("logintest@example.com"))
                .andExpect(jsonPath("$.data.userId").isNumber())
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    public void testUserLogin_InvalidEmail() throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "nonexistent@example.com");
        loginRequest.put("password", "password123");

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    public void testUserLogin_WrongPassword() throws Exception {
        // First register a user
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("email", "wrongpwd@example.com");
        registerRequest.put("password", "password123");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Try login with wrong password
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "wrongpwd@example.com");
        loginRequest.put("password", "wrongpassword");

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    public void testUserLogin_MissingEmail() throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("password", "password123");

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email and password are required"));
    }

    @Test
    public void testUserLogin_MissingPassword() throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "test@example.com");

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email and password are required"));
    }

    @Test
    public void testRegistrationAndLoginWorkTogether() throws Exception {
        // Step 1: Register
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("email", "workflow@example.com");
        registerRequest.put("password", "securepass123");

        MvcResult registerResult = mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String registerResponse = registerResult.getResponse().getContentAsString();
        String registrationToken = objectMapper.readTree(registerResponse).at("/data/token").asText();
        Long registeredUserId = objectMapper.readTree(registerResponse).at("/data/userId").asLong();

        assertThat(registrationToken).isNotEmpty();
        assertThat(registeredUserId).isGreaterThan(0);

        // Step 2: Login with same credentials
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "workflow@example.com");
        loginRequest.put("password", "securepass123");

        MvcResult loginResult = mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String loginResponse = loginResult.getResponse().getContentAsString();
        String loginToken = objectMapper.readTree(loginResponse).at("/data/token").asText();
        Long loginUserId = objectMapper.readTree(loginResponse).at("/data/userId").asLong();

        assertThat(loginToken).isNotEmpty();
        assertThat(loginUserId).isEqualTo(registeredUserId);
    }
}
