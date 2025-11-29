package com.arbu.childstoryapp.expenses;

import com.arbu.childstoryapp.auth.AuthService;
import com.arbu.childstoryapp.common.UnauthorizedException;
import com.arbu.childstoryapp.domain.Expense;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.expenses.dto.CreateExpenseRequest;
import com.arbu.childstoryapp.expenses.dto.ExpenseResponse;
import com.arbu.childstoryapp.repository.ExpenseRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
@Validated
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final AuthService authService;

    public ExpenseController(ExpenseRepository expenseRepository, AuthService authService) {
        this.expenseRepository = expenseRepository;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> list(@RequestHeader(value = "X-Auth-Token", required = false) String token) {
        UserAccount user = authService.authenticate(token).orElseThrow(() -> new UnauthorizedException("Geçersiz veya eksik oturum anahtarı"));
        List<ExpenseResponse> list = expenseRepository.findByUser_Id(user.getId()).stream()
                .map(ExpenseResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@RequestHeader(value = "X-Auth-Token", required = false) String token,
                                                  @Valid @RequestBody CreateExpenseRequest req) {
        UserAccount user = authService.authenticate(token).orElseThrow(() -> new UnauthorizedException("Geçersiz veya eksik oturum anahtarı"));
        Expense e = new Expense();
        e.setUser(user);
        e.setAmount(req.getAmount());
        e.setCurrency(req.getCurrency().toUpperCase());
        e.setCategory(req.getCategory());
        e.setDescription(req.getDescription());
        e.setCreatedAt(Instant.now());
        e = expenseRepository.save(e);
        return ResponseEntity.ok(ExpenseResponse.fromEntity(e));
    }
}
