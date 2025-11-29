package com.arbu.childstoryapp.auth;

import com.arbu.childstoryapp.auth.dto.VerifyOtpResponse;
import com.arbu.childstoryapp.domain.OtpCode;
import com.arbu.childstoryapp.domain.SessionToken;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.repository.OtpCodeRepository;
import com.arbu.childstoryapp.repository.SessionTokenRepository;
import com.arbu.childstoryapp.repository.UserAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final OtpCodeRepository otpRepo;
    private final UserAccountRepository userRepo;
    private final SessionTokenRepository tokenRepo;

    public AuthService(OtpCodeRepository otpRepo, UserAccountRepository userRepo, SessionTokenRepository tokenRepo) {
        this.otpRepo = otpRepo;
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
    }

    @Transactional
    public void requestOtp(String phoneNumber) {
        String normalized = normalizePhone(phoneNumber);
        String code = generateCode();
        Instant expiresAt = Instant.now().plus(5, ChronoUnit.MINUTES);
        // overwrite or create new
        OtpCode otp = otpRepo.findByPhoneNumber(normalized).orElseGet(OtpCode::new);
        otp.setPhoneNumber(normalized);
        otp.setCode(code);
        otp.setExpiresAt(expiresAt);
        otp.setAttemptCount(0);
        otpRepo.save(otp);
        log.info("[OTP] phone={} code={} expiresAt={}", normalized, code, expiresAt);
    }

    @Transactional
    public VerifyOtpResponse verifyOtp(String phoneNumber, String code, String displayName) {
        String normalized = normalizePhone(phoneNumber);
        OtpCode otp = otpRepo.findByPhoneNumber(normalized)
                .orElseThrow(() -> new IllegalArgumentException("OTP bulunamadı. Lütfen yeni kod isteyin."));
        if (otp.getExpiresAt() == null || Instant.now().isAfter(otp.getExpiresAt())) {
            otpRepo.delete(otp);
            throw new IllegalArgumentException("OTP süresi dolmuş. Lütfen yeni kod isteyin.");
        }
        if (otp.getAttemptCount() != null && otp.getAttemptCount() >= 5) {
            otpRepo.delete(otp);
            throw new IllegalArgumentException("Çok fazla deneme. Lütfen yeni kod isteyin.");
        }
        if (!otp.getCode().equals(code)) {
            otp.setAttemptCount(Optional.ofNullable(otp.getAttemptCount()).orElse(0) + 1);
            otpRepo.save(otp);
            throw new IllegalArgumentException("OTP kodu hatalı.");
        }
        // success: delete otp
        otpRepo.delete(otp);

        UserAccount user = userRepo.findByPhoneNumber(normalized).orElseGet(() -> {
            UserAccount u = new UserAccount();
            u.setPhoneNumber(normalized);
            u.setPremium(false);
            Instant now = Instant.now();
            u.setCreatedAt(now);
            u.setUpdatedAt(now);
            return userRepo.save(u);
        });
        if (displayName != null && !displayName.isBlank()) {
            user.setDisplayName(displayName.trim());
        }
        user.setUpdatedAt(Instant.now());
        user = userRepo.save(user);

        // issue token valid for 30 days
        SessionToken token = new SessionToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));
        tokenRepo.save(token);

        return new VerifyOtpResponse(token.getToken(), user.getId(), user.getPhoneNumber(), user.getEmail(), user.getDisplayName(), Boolean.TRUE.equals(user.getPremium()));
    }

    @Transactional
    public VerifyOtpResponse register(String email, String password, String displayName) {
        if (userRepo.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        UserAccount user = new UserAccount();
        user.setEmail(email);
        user.setPasswordHash(hashPassword(password));
        user.setDisplayName(displayName);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setPremium(false);
        user = userRepo.save(user);
        return createSession(user);
    }

    @Transactional
    public VerifyOtpResponse login(String email, String password) {
        UserAccount user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        
        if (user.getPasswordHash() == null || !user.getPasswordHash().equals(hashPassword(password))) {
             throw new IllegalArgumentException("Invalid email or password");
        }
        return createSession(user);
    }

    private VerifyOtpResponse createSession(UserAccount user) {
        SessionToken token = new SessionToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));
        tokenRepo.save(token);
        return new VerifyOtpResponse(token.getToken(), user.getId(), user.getPhoneNumber(), user.getEmail(), user.getDisplayName(), Boolean.TRUE.equals(user.getPremium()));
    }

    private String hashPassword(String password) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Optional<UserAccount> authenticate(String token) {
        if (token == null || token.isBlank()) return Optional.empty();
        return tokenRepo.findById(token)
                .filter(t -> t.getExpiresAt() == null || Instant.now().isBefore(t.getExpiresAt()))
                .map(SessionToken::getUser);
    }

    private String generateCode() {
        int n = new Random().nextInt(900000) + 100000; // 100000..999999
        return String.valueOf(n);
    }

    private String normalizePhone(String phone) {
        // basic normalization: trim, remove spaces
        return phone == null ? null : phone.replaceAll("\\s+", "").trim();
    }
}
