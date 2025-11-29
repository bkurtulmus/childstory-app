package com.arbu.childstoryapp.expenses.dto;

import com.arbu.childstoryapp.domain.Expense;

import java.math.BigDecimal;
import java.time.Instant;

public class ExpenseResponse {
    private Long id;
    private BigDecimal amount;
    private String currency;
    private String category;
    private String description;
    private Instant createdAt;

    public static ExpenseResponse fromEntity(Expense e) {
        ExpenseResponse r = new ExpenseResponse();
        r.id = e.getId();
        r.amount = e.getAmount();
        r.currency = e.getCurrency();
        r.category = e.getCategory();
        r.description = e.getDescription();
        r.createdAt = e.getCreatedAt();
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
