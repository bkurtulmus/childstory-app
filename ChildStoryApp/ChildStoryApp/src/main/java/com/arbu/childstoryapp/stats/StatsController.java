package com.arbu.childstoryapp.stats;

import com.arbu.childstoryapp.auth.AuthService;
import com.arbu.childstoryapp.common.UnauthorizedException;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.repository.ChildProfileRepository;
import com.arbu.childstoryapp.repository.ExpenseRepository;
import com.arbu.childstoryapp.repository.StoryGenerationLogRepository;
import com.arbu.childstoryapp.stats.dto.StatsSummaryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/stats")
@Validated
public class StatsController {

    private final AuthService authService;
    private final ChildProfileRepository childRepo;
    private final ExpenseRepository expenseRepo;
    private final StoryGenerationLogRepository storyLogRepo;

    public StatsController(AuthService authService,
                           ChildProfileRepository childRepo,
                           ExpenseRepository expenseRepo,
                           StoryGenerationLogRepository storyLogRepo) {
        this.authService = authService;
        this.childRepo = childRepo;
        this.expenseRepo = expenseRepo;
        this.storyLogRepo = storyLogRepo;
    }

    @GetMapping("/summary")
    public ResponseEntity<StatsSummaryResponse> summary(@RequestHeader(value = "X-Auth-Token", required = false) String token) {
        UserAccount user = authService.authenticate(token).orElseThrow(() -> new UnauthorizedException("Geçersiz veya eksik oturum anahtarı"));
        long childCount = childRepo.countByUser_Id(user.getId());
        long expenseCount = expenseRepo.countByUser_Id(user.getId());
        BigDecimal totalExpense = expenseRepo.sumAmountByUserId(user.getId());
        long storyCount = storyLogRepo.countByUser_Id(user.getId());
        StatsSummaryResponse resp = new StatsSummaryResponse(childCount, expenseCount, totalExpense, storyCount);
        return ResponseEntity.ok(resp);
    }
}
