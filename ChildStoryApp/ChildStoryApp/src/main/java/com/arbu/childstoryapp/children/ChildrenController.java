package com.arbu.childstoryapp.children;

import com.arbu.childstoryapp.auth.AuthService;
import com.arbu.childstoryapp.common.UnauthorizedException;
import com.arbu.childstoryapp.children.dto.ChildResponse;
import com.arbu.childstoryapp.children.dto.CreateChildRequest;
import com.arbu.childstoryapp.children.dto.UpdateChildRequest;
import com.arbu.childstoryapp.domain.ChildProfile;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.repository.ChildProfileRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/children")
@Validated
public class ChildrenController {

    private final ChildProfileRepository childRepo;
    private final AuthService authService;
    private final ChildService childService;

    public ChildrenController(ChildProfileRepository childRepo, AuthService authService, ChildService childService) {
        this.childRepo = childRepo;
        this.authService = authService;
        this.childService = childService;
    }

    @GetMapping
    public ResponseEntity<List<ChildResponse>> list(@RequestHeader(value = "X-Auth-Token", required = false) String token) {
        UserAccount user = authService.authenticate(token).orElseThrow(() -> new UnauthorizedException("Geçersiz veya eksik oturum anahtarı"));
        List<ChildResponse> list = childRepo.findByUser_Id(user.getId()).stream()
                .map(ChildResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChildResponse> get(@RequestHeader(value = "X-Auth-Token", required = false) String token,
                                             @PathVariable("id") Long id) {
        UserAccount user = authService.authenticate(token).orElseThrow(() -> new UnauthorizedException("Geçersiz veya eksik oturum anahtarı"));
        ChildProfile cp = childRepo.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Çocuk kaydı bulunamadı"));
        return ResponseEntity.ok(ChildResponse.fromEntity(cp));
    }

    @PostMapping
    public ResponseEntity<ChildResponse> create(@RequestHeader(value = "X-Auth-Token", required = false) String token,
                                                @Valid @RequestBody CreateChildRequest req) {
        UserAccount user = authService.authenticate(token).orElseThrow(() -> new UnauthorizedException("Geçersiz veya eksik oturum anahtarı"));
        ChildProfile cp = new ChildProfile();
        cp.setUser(user);
        cp.setName(req.getName());
        cp.setInterests(req.getInterests());
        cp.setBirthDate(req.getBirthDate());
        // Enhanced Profile Fields for v3.0
        cp.setLikes(req.getLikes());
        cp.setDislikes(req.getDislikes());
        cp.setFears(req.getFears());
        cp.setRelationships(req.getRelationships());
        cp.setAvatarUrl(req.getAvatarUrl());
        cp.setCreatedAt(Instant.now());
        cp.setUpdatedAt(Instant.now());
        cp = childRepo.save(cp);
        return ResponseEntity.ok(ChildResponse.fromEntity(cp));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChildResponse> update(@RequestHeader(value = "X-Auth-Token", required = false) String token,
                                                @PathVariable("id") Long id,
                                                @Valid @RequestBody UpdateChildRequest req) {
        UserAccount user = authService.authenticate(token).orElseThrow(() -> new UnauthorizedException("Geçersiz veya eksik oturum anahtarı"));
        ChildProfile cp = childRepo.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Çocuk kaydı bulunamadı"));
        if (req.getName() != null) cp.setName(req.getName());
        if (req.getInterests() != null) cp.setInterests(req.getInterests());
        if (req.getBirthDate() != null) cp.setBirthDate(req.getBirthDate());
        // Enhanced Profile Fields for v3.0 (partial updates)
        if (req.getLikes() != null) cp.setLikes(req.getLikes());
        if (req.getDislikes() != null) cp.setDislikes(req.getDislikes());
        if (req.getFears() != null) cp.setFears(req.getFears());
        if (req.getRelationships() != null) cp.setRelationships(req.getRelationships());
        if (req.getAvatarUrl() != null) cp.setAvatarUrl(req.getAvatarUrl());
        cp.setUpdatedAt(Instant.now());
        cp = childRepo.save(cp);
        return ResponseEntity.ok(ChildResponse.fromEntity(cp));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader(value = "X-Auth-Token", required = false) String token,
                                       @PathVariable("id") Long id) {
        UserAccount user = authService.authenticate(token).orElseThrow(() -> new UnauthorizedException("Geçersiz veya eksik oturum anahtarı"));
        ChildProfile cp = childRepo.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Çocuk kaydı bulunamadı"));
        childRepo.delete(cp);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/word-bag")
    public ResponseEntity<ChildResponse> addToWordBag(@RequestHeader(value = "X-Auth-Token", required = false) String token,
                                                       @PathVariable("id") Long id,
                                                       @RequestBody List<String> wordIds) {
        UserAccount user = authService.authenticate(token).orElseThrow(() -> new UnauthorizedException("Geçersiz veya eksik oturum anahtarı"));
        ChildProfile cp = childService.addToWordBag(id, user.getId(), wordIds);
        return ResponseEntity.ok(ChildResponse.fromEntity(cp));
    }
}
