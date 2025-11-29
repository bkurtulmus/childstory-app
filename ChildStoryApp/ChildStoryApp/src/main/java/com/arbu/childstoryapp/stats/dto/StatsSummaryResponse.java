package com.arbu.childstoryapp.stats.dto;

import java.math.BigDecimal;

public class StatsSummaryResponse {
    private long childCount;
    private long expenseCount;
    private BigDecimal totalExpense;
    private long storyGenerationCount;

    public StatsSummaryResponse() {}

    public StatsSummaryResponse(long childCount, long expenseCount, BigDecimal totalExpense, long storyGenerationCount) {
        this.childCount = childCount;
        this.expenseCount = expenseCount;
        this.totalExpense = totalExpense;
        this.storyGenerationCount = storyGenerationCount;
    }

    public long getChildCount() { return childCount; }
    public void setChildCount(long childCount) { this.childCount = childCount; }

    public long getExpenseCount() { return expenseCount; }
    public void setExpenseCount(long expenseCount) { this.expenseCount = expenseCount; }

    public BigDecimal getTotalExpense() { return totalExpense; }
    public void setTotalExpense(BigDecimal totalExpense) { this.totalExpense = totalExpense; }

    public long getStoryGenerationCount() { return storyGenerationCount; }
    public void setStoryGenerationCount(long storyGenerationCount) { this.storyGenerationCount = storyGenerationCount; }
}
