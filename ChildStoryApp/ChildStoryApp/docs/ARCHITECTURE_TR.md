# DreamTales AI - Uygulama Mimarisi ve Yapı (v3.0)

Bu doküman, DreamTales AI backend uygulamasının teknik mimarisini, katmanlarını ve veri akışını açıklar.

## İçindekiler
1. [Sürüm 3.0 Yenilikleri](#sürüm-30-yenilikleri)
2. [Genel Mimari](#genel-mimari)
3. [Proje Yapısı](#proje-yapısı)
4. [Katmanlar ve Sorumluluklar](#katmanlar-ve-sorumluluklar)
5. [Servisler (Services)](#servisler-services)
6. [Mapperlar ve DTO Dönüşümleri](#mapperlar-ve-dto-dönüşümleri)
7. [Veri Akışı](#veri-akışı)
8. [API İstek Örnekleri](#api-istek-örnekleri)

---

## Sürüm 3.0 Yenilikleri

DreamTales AI v3.0, platformu temel MVP'den tam özellikli, kişiselleştirilmiş bir hikaye anlatım sistemine dönüştürür.

### Gelişmiş Çocuk Profilleri
**ChildProfile** entity'si şimdi derin kişiselleştirme desteği sunuyor:
- **likes** (TEXT): Sevdikleri şeyler (hayvanlar, renkler, oyuncaklar) - JSON format
- **dislikes** (TEXT): Sevmedikleri şeyler - JSON format
- **fears** (TEXT): Korkular ve endişeler - JSON array format
- **relationships** (TEXT): Arkadaşlar, kardeşler, evcil hayvanlar - JSON format
- **avatarUrl**: Profil resmi URL'i

### Yeni Domain Entity'ler

1. **Story**: Kaydedilmiş hikayeleri temsil eder
   - Metin, görsel URL'leri, ses/video URL'leri
   - Seri hikayeler için parentStory referansı
   - Etkileşimli mod bayrağı
   - Aile paylaşımı için shareToken
   - Kullanıcı çizimi URL'i

2. **SubscriptionPlan**: Abonelik planı tanımları
   - Plan kodu, isim, fiyat
   - Özellik bayrakları (hasCreativeMode, hasInteractiveMode, hasSeriesStories, vb.)
   - Günlük hikaye limitleri
   - Maksimum çocuk profili sayısı

3. **UserSubscription**: Kullanıcı abonelik durumu
   - Mevcut plan referansı
   - Durum (active, expired, cancelled)
   - Günlük kullanım takibi
   - Faturalama bilgileri

4. **InteractiveStoryChoice**: "Kendi Maceranı Seç" dallanma noktaları
   - Seçim noktası sırası
   - Soru metni
   - Seçenek A, B, C
   - Her seçenek için devam metni ve görsel

5. **VoiceCloneData**: Ebeveyn sesi klonlama verileri
   - Ses modeli bilgileri
   - İşleme durumu
   - Onay ve güvenlik alanları (consentConfirmed, consentIpAddress)
   - Kullanım istatistikleri

### Geliştirilmiş AI Servisi

**GeminiAiService** şimdi iki metod sunuyor:
- `generateStory()`: Legacy MVP endpoint (geriye dönük uyumluluk)
- `generateStoryV3()`: Gelişmiş v3.0 metodu
  - **Otomatik profil entegrasyonu**: Çocuk profili (likes, dislikes, fears, relationships) otomatik olarak prompt'a entegre edilir
  - **Quick vs Creative modları**: Farklı prompt yapıları
  - **Korku yönetimi**: "Address but never trigger" mantığıyla hassas yaklaşım
  - **Seri hikaye desteği**: Önceki hikayeyi bağlam olarak dahil eder
  - **Dil öğrenimi modu**: Yabancı kelimeler bağlamsal öğretim ile eklenir
  - **Etkileşimli mod**: Dallanma seçimleri ile hikaye oluşturur

### Yeni Repository'ler

v3.0 ile eklenen repository'ler:
- **StoryRepository**: Hikaye CRUD, favoriler, paylaşım, seriler
- **SubscriptionPlanRepository**: Plan yönetimi
- **UserSubscriptionRepository**: Kullanıcı abonelik durumu
- **InteractiveStoryChoiceRepository**: Etkileşimli seçim yönetimi
- **VoiceCloneDataRepository**: Ses klonlama veri yönetimi

### Güncellenen DTO'lar

**GenerateStoryRequest** artık şunları destekliyor:
- `childProfileId`: İsim yerine profil ID'si
- `mode`: "quick" veya "creative"
- `customPrompt`: Yaratıcı mod için detaylı senaryo
- `isInteractive`: Etkileşimli mod bayrağı
- `parentStoryId`: Seri hikaye devamı için
- `enableLanguageLearning` + `learningLanguage`: Dil öğrenimi
- `voiceCloneId`: Ebeveyn sesi ile anlatım
- `generateSlideshow`: Video format
- `quality`: Kalite seviyesi

**ChildProfile DTO'ları** (CreateChildRequest, UpdateChildRequest, ChildResponse) artık tüm yeni profil alanlarını içeriyor.

---

## Genel Mimari

DreamTales AI backend uygulaması, **Spring Boot 3.5.7** tabanlı, katmanlı bir REST API'dir.

### Teknoloji Stack
- **Framework**: Spring Boot 3.5.7
- **Java**: 21
- **ORM**: Spring Data JPA (Hibernate)
- **Veritabanı**: H2 (geliştirme), PostgreSQL (prod hazır)
- **Web**: Spring MVC + Spring WebFlux (Gemini API çağrıları için)
- **Validasyon**: Jakarta Validation (Bean Validation)
- **Build**: Maven

### Mimari Stil
Klasik **3-katmanlı mimari** + **DTO pattern**:
```
[HTTP İstek] 
    ↓
[Controller Katmanı] - İstekleri karşılar, validasyon yapar
    ↓
[Service Katmanı] - İş mantığını yürütür
    ↓
[Repository Katmanı] - Veritabanı erişimi (Spring Data JPA)
    ↓
[Database (H2/PostgreSQL)]
```

---

## Proje Yapısı

```
src/main/java/com/arbu/childstoryapp/
│
├── ChildStoryAppApplication.java          # Ana Spring Boot sınıfı
│
├── ai/                                    # Yapay Zeka (Gemini) modülü
│   ├── AiController.java                  # POST /api/ai/generate-story
│   ├── GeminiAiService.java               # Gemini API entegrasyonu
│   └── dto/
│       ├── GenerateStoryRequest.java
│       └── GenerateStoryResponse.java
│
├── auth/                                  # Kimlik doğrulama modülü
│   ├── AuthController.java                # POST /api/auth/request-otp, /verify-otp
│   ├── AuthService.java                   # OTP ve token yönetimi
│   └── dto/
│       ├── RequestOtpRequest.java
│       ├── VerifyOtpRequest.java
│       └── VerifyOtpResponse.java
│
├── children/                              # Çocuk profilleri modülü
│   ├── ChildrenController.java            # CRUD endpoints: /api/children
│   └── dto/
│       ├── ChildResponse.java
│       ├── CreateChildRequest.java
│       └── UpdateChildRequest.java
│
├── expenses/                              # Harcama takibi modülü
│   ├── ExpenseController.java             # GET/POST /api/expenses
│   └── dto/
│       ├── CreateExpenseRequest.java
│       └── ExpenseResponse.java
│
├── stats/                                 # İstatistikler modülü
│   ├── StatsController.java               # GET /api/stats/summary
│   └── dto/
│       └── StatsSummaryResponse.java
│
├── domain/                                # Veritabanı entity'leri
│   ├── UserAccount.java                   # Kullanıcı hesabı
│   ├── ChildProfile.java                  # Çocuk profili (v3.0: Geliştirilmiş)
│   ├── Expense.java                       # Harcama kaydı
│   ├── StoryGenerationLog.java            # Hikaye üretim logu
│   ├── OtpCode.java                       # OTP kodları
│   ├── SessionToken.java                  # Oturum token'ları
│   ├── Story.java                         # v3.0: Kaydedilmiş hikayeler
│   ├── SubscriptionPlan.java              # v3.0: Abonelik planları
│   ├── UserSubscription.java              # v3.0: Kullanıcı abonelikleri
│   ├── InteractiveStoryChoice.java        # v3.0: Etkileşimli hikaye seçimleri
│   └── VoiceCloneData.java                # v3.0: Ses klonlama verileri
│
├── repository/                            # Spring Data JPA repository'leri
│   ├── UserAccountRepository.java
│   ├── ChildProfileRepository.java
│   ├── ExpenseRepository.java
│   ├── StoryGenerationLogRepository.java
│   ├── OtpCodeRepository.java
│   ├── SessionTokenRepository.java
│   ├── StoryRepository.java               # v3.0: Hikaye yönetimi
│   ├── SubscriptionPlanRepository.java    # v3.0: Abonelik planları
│   ├── UserSubscriptionRepository.java    # v3.0: Kullanıcı abonelikleri
│   ├── InteractiveStoryChoiceRepository.java  # v3.0: Etkileşimli seçimler
│   └── VoiceCloneDataRepository.java      # v3.0: Ses klonlama
│
└── common/                                # Ortak yardımcı sınıflar
    ├── GlobalExceptionHandler.java        # Global hata yönetimi
    └── UnauthorizedException.java         # Custom exception
```

---

## Katmanlar ve Sorumluluklar

### 1. Controller Katmanı
**Lokasyon**: `*.controller` paketleri (`ai/`, `auth/`, `children/`, `expenses/`, `stats/`)

**Sorumluluklar**:
- HTTP isteklerini karşılamak
- Request DTO'larını validate etmek (`@Valid`)
- Auth token kontrolü (`X-Auth-Token` header)
- Service katmanını çağırmak
- Response DTO'ları dönmek

**Örnekler**:
- `AiController` - Hikaye üretme endpoint'i
- `AuthController` - OTP gönderme ve doğrulama
- `ChildrenController` - Çocuk CRUD işlemleri
- `ExpenseController` - Harcama kayıtları
- `StatsController` - Kullanıcı istatistikleri

### 2. Service Katmanı
**Lokasyon**: `*.service` sınıfları

**Sorumluluklar**:
- İş mantığını yürütmek
- Transaction yönetimi (`@Transactional`)
- Domain entity'leri ile çalışmak
- Repository'leri çağırmak
- Harici API'lere entegrasyon (Gemini)

**Mevcut Servisler**:

#### `AuthService` (`auth/AuthService.java`)
- OTP kodu üretme ve doğrulama
- Kullanıcı kaydı/girişi
- Session token yönetimi
- Token ile kullanıcı kimlik doğrulama

**Temel Metodlar**:
```java
void requestOtp(String phoneNumber)
VerifyOtpResponse verifyOtp(String phoneNumber, String code, String displayName)
Optional<UserAccount> authenticate(String token)
```

#### `GeminiAiService` (`ai/GeminiAiService.java`)
- Google Gemini API entegrasyonu
- Hikaye metni üretme (text generation)
- **Çok modlu içerik üretimi (multimodal generation)**: Görsel ve ses
- API key yönetimi (environment variable)

**Temel Metodlar (v3.0)**:
```java
// Legacy method (geriye dönük uyumluluk)
String generateStory(String childName, String theme, String lesson)

// Enhanced v3.0 story generation with full profile integration
String generateStoryV3(GenerateStoryRequest request, ChildProfile childProfile, Story parentStory)

// Multimodal generation methods
List<String> generateSceneDescriptions(String storyText, String childName, int sceneCount)
String generateImage(String sceneDescription, String quality)
String generateAudio(String storyText, String languageCode, String voiceName)

String getModelName()
```

**Çok Modlu İçerik Üretimi (Multimodal Generation)**:

GeminiAiService artık sadece hikaye metni değil, aynı zamanda görseller ve ses dosyaları da üretebiliyor:

1. **generateSceneDescriptions()**: 
   - Gemini AI kullanarak hikaye metninden 3-5 anahtar sahne açıklaması çıkarır
   - Her açıklama, görsel üretimi için detaylı bir prompt içerir
   - Çocuğun adı, ortam, karakterler, ruh hali ve sanat stili bilgilerini içerir

2. **generateImage()**: 
   - Sahne açıklamalarından görsel üretir
   - Şu an MVP için placeholder URL döner (Google Imagen API entegrasyonu için hazır)
   - Production'da Google Cloud Vertex AI Imagen API kullanılacak

3. **generateAudio()**: 
   - Hikaye metninden sesli anlatım (TTS) üretir
   - Şu an MVP için placeholder URL döner (Google Cloud TTS API entegrasyonu için hazır)
   - Production'da Google Cloud Text-to-Speech API kullanılacak
   - Dil ve ses seçimi desteklenir (örn: tr-TR, tr-TR-Wavenet-A)

**Multimodal Generation Workflow**:
```
1. generateStoryV3() → Hikaye metni oluştur
2. generateSceneDescriptions() → Gemini ile sahneleri çıkar
3. generateImage() → Her sahne için görsel oluştur (Imagen)
4. generateAudio() → Hikaye için ses anlatımı oluştur (TTS)
5. Return: {story, imageUrls[], audioUrl}
```

### 3. Repository Katmanı
**Lokasyon**: `repository/` paketi

**Sorumluluklar**:
- Veritabanı CRUD işlemleri
- Custom query'ler
- Spring Data JPA ile otomatik implementasyon

**Tüm Repository'ler**:
```java
UserAccountRepository         // findByPhoneNumber()
ChildProfileRepository         // findByUser_Id(), findFirstByUser_IdAndNameIgnoreCase()
ExpenseRepository              // findByUser_IdOrderByCreatedAtDesc()
StoryGenerationLogRepository   // countByUser_Id()
OtpCodeRepository              // findByPhoneNumber()
SessionTokenRepository         // findById() [token string]
```

### 4. Domain (Entity) Katmanı
**Lokasyon**: `domain/` paketi

**Sorumluluklar**:
- Veritabanı tablolarını temsil etmek
- İlişkileri tanımlamak (`@OneToMany`, `@ManyToOne`)
- JPA anotasyonları

**Entity İlişkileri**:
```
UserAccount (1) ───< ChildProfile (N)
UserAccount (1) ───< Expense (N)
UserAccount (1) ───< StoryGenerationLog (N)
UserAccount (1) ───< SessionToken (N)
UserAccount (1) ───< OtpCode (1)

ChildProfile (1) ───< StoryGenerationLog (N)
```

---

## Servisler (Services)

### Nerede Bulunur?
Servisler, modül içinde doğrudan veya ayrı paketlerde yer alır:
- `auth/AuthService.java`
- `ai/GeminiAiService.java`

### Neden Sadece 2 Servis Var?
Bu bir **MVP (Minimum Viable Product)** uygulamasıdır. Şu anda:
- **AuthService**: Kimlik doğrulama iş mantığı
- **GeminiAiService**: AI hikaye üretimi

Diğer modüller (`children`, `expenses`, `stats`) **basit CRUD işlemleri** yaptığı için, iş mantığı doğrudan **Controller içinde** yürütülüyor ve Repository'ler doğrudan çağrılıyor.

### Gelecek İyileştirmeler
Proje büyüdükçe eklenebilecek servisler:
- `ChildService` - Çocuk profili iş mantığı (örn: yaş hesaplama, ilgi alanı analizi)
- `ExpenseService` - Harcama raporlama ve analiz
- `StatsService` - Kompleks istatistik hesaplamaları
- `StoryService` - Hikaye saklama, kütüphane yönetimi

---

## Mapperlar ve DTO Dönüşümleri

### Neden Mapper Sınıfı Yok?
Bu projede **ayrı bir mapper katmanı yoktur**. Bunun yerine:

### DTO Dönüşüm Stratejisi: Static Factory Methods

DTO sınıflarının içinde **static factory metodlar** kullanılıyor:

#### Örnek 1: `ChildResponse.fromEntity()`
```java
public class ChildResponse {
    private Long id;
    private String name;
    // ... diğer alanlar

    public static ChildResponse fromEntity(ChildProfile entity) {
        ChildResponse dto = new ChildResponse();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setInterests(entity.getInterests());
        dto.setBirthDate(entity.getBirthDate());
        return dto;
    }
}
```

**Kullanım (Controller içinde)**:
```java
ChildProfile entity = childRepo.findById(id).orElseThrow();
ChildResponse dto = ChildResponse.fromEntity(entity);
return ResponseEntity.ok(dto);
```

#### Örnek 2: `ExpenseResponse.fromEntity()`
Aynı pattern:
```java
public static ExpenseResponse fromEntity(Expense expense) {
    // Entity → DTO dönüşümü
}
```

### Manuel Dönüşüm
Bazı yerlerde, DTO doğrudan Constructor ile oluşturuluyor:

**AuthService.java**:
```java
return new VerifyOtpResponse(
    token.getToken(), 
    user.getId(), 
    user.getPhoneNumber(), 
    user.getDisplayName(), 
    Boolean.TRUE.equals(user.getPremium())
);
```

### Neden MapStruct veya ModelMapper Kullanılmıyor?
**MVP için gereksiz karmaşıklık**:
- DTO'lar basit (5-10 alan)
- İlişkiler karmaşık değil
- Static factory metodları yeterli ve şeffaf

**İlerde kullanılabilir**: Eğer DTO-Entity dönüşümleri karmaşıklaşırsa (nested object'ler, çok sayıda alan), MapStruct eklenebilir.

---

## Veri Akışı

### Örnek 1: Kimlik Doğrulama Akışı (OTP Login)

#### 1. OTP İsteği
```
[Kullanıcı] 
    ↓ POST /api/auth/request-otp {"phoneNumber": "+905551112233"}
[AuthController] 
    ↓ authService.requestOtp(phoneNumber)
[AuthService]
    ↓ OTP kodu üretir (6 haneli)
    ↓ otpRepo.save() → OtpCode entity'sini kaydeder
    ↓ Log'a yazdırır (SMS yerine, MVP için)
[RESPONSE] 200 OK {"message": "OTP kodu gönderildi"}
```

#### 2. OTP Doğrulama
```
[Kullanıcı]
    ↓ POST /api/auth/verify-otp {"phoneNumber": "+9055...", "code": "123456", "displayName": "Arda"}
[AuthController]
    ↓ authService.verifyOtp(...)
[AuthService]
    ↓ OTP kodunu doğrular (süre, deneme sayısı, kod eşleşmesi)
    ↓ Kullanıcı yoksa → yeni UserAccount oluşturur
    ↓ UUID token üretir → SessionToken entity'si kaydeder
    ↓ VerifyOtpResponse DTO'su oluşturur (manuel constructor)
[RESPONSE] 200 OK {"token": "uuid", "userId": 1, "phoneNumber": "+905...", ...}
```

### Örnek 2: Çocuk Profili Ekleme (Authenticated)

```
[Kullanıcı]
    ↓ POST /api/children
    ↓ Header: X-Auth-Token: <uuid>
    ↓ Body: {"name": "Ece", "interests": "Uzay", "birthDate": "2018-06-01"}
[ChildrenController]
    ↓ authService.authenticate(token) → UserAccount döner veya 401
    ↓ CreateChildRequest validate edilir (@Valid)
    ↓ Yeni ChildProfile entity oluşturulur
    ↓ entity.setUser(authenticatedUser)
    ↓ childRepo.save(entity)
    ↓ ChildResponse.fromEntity(savedEntity) → DTO dönüşümü
[RESPONSE] 200 OK {"id": 5, "name": "Ece", ...}
```

### Örnek 3: Hikaye Üretme (AI)

```
[Kullanıcı]
    ↓ POST /api/ai/generate-story
    ↓ Header: X-Auth-Token: <uuid> (opsiyonel)
    ↓ Body: {"childName": "Ece", "theme": "Uzay", "lesson": "Paylaşmak"}
[AiController]
    ↓ GenerateStoryRequest validate edilir
    ↓ geminiAiService.generateStory(childName, theme, lesson)
[GeminiAiService]
    ↓ GEMINI_API_KEY environment variable okunur
    ↓ Prompt oluşturulur (Türkçe hikaye, 6-8 cümle, vs.)
    ↓ WebClient ile Google Gemini API'ye POST isteği
    ↓ JSON response parse edilir → text çıkarılır
    ↓ String olarak döner
[AiController]
    ↓ Token varsa → AuthService ile kullanıcı bulunur
    ↓ StoryGenerationLog entity'si oluşturulur (istatistik için)
    ↓ storyLogRepo.save(log)
    ↓ GenerateStoryResponse(story) döner
[RESPONSE] 200 OK {"story": "Bir varmış bir yokmuş..."}
```

---

## API İstek Örnekleri

### 1. Kayıt/Giriş (OTP)
```bash
# OTP isteği
curl -X POST http://localhost:8080/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+905551112233"}'

# OTP doğrulama (sunucu loglarından kodu al)
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+905551112233", "code": "123456", "displayName": "Arda"}'

# Response: {"token": "abc-123-uuid", "userId": 1, ...}
```

### 2. Çocuk Profili Yönetimi
```bash
# Çocuk ekle (token gerekli)
curl -X POST http://localhost:8080/api/children \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: abc-123-uuid" \
  -d '{"name": "Ece", "interests": "Uzay, dans", "birthDate": "2018-06-01"}'

# Çocukları listele
curl -X GET http://localhost:8080/api/children \
  -H "X-Auth-Token: abc-123-uuid"

# Çocuk güncelle
curl -X PUT http://localhost:8080/api/children/1 \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: abc-123-uuid" \
  -d '{"name": "Ece Yıldız"}'

# Çocuk sil
curl -X DELETE http://localhost:8080/api/children/1 \
  -H "X-Auth-Token: abc-123-uuid"
```

### 3. Hikaye Üretme
```bash
# Token olmadan (anonim)
curl -X POST http://localhost:8080/api/ai/generate-story \
  -H "Content-Type: application/json" \
  -d '{"childName": "Ece", "theme": "Uzay", "lesson": "Paylaşmak"}'

# Token ile (istatistikler için kaydedilir)
curl -X POST http://localhost:8080/api/ai/generate-story \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: abc-123-uuid" \
  -d '{"childName": "Ece", "theme": "Uzay", "lesson": "Paylaşmak"}'
```

### 4. Harcama ve İstatistikler
```bash
# Harcama ekle
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: abc-123-uuid" \
  -d '{"amount": 39.90, "currency": "TRY", "category": "subscription", "description": "Aylık premium"}'

# Harcamaları listele
curl -X GET http://localhost:8080/api/expenses \
  -H "X-Auth-Token: abc-123-uuid"

# İstatistikleri getir
curl -X GET http://localhost:8080/api/stats/summary \
  -H "X-Auth-Token: abc-123-uuid"

# Response: {"childCount": 2, "expenseCount": 5, "totalExpense": 199.50, "storyGenerationCount": 12}
```

---

## Hata Yönetimi

### GlobalExceptionHandler
**Lokasyon**: `common/GlobalExceptionHandler.java`

Tüm exception'lar merkezi olarak yakalanır ve JSON response döner:

| Exception | HTTP Status | Açıklama |
|-----------|-------------|----------|
| `MethodArgumentNotValidException` | 400 | Bean Validation hatası (örn: boş alan) |
| `IllegalArgumentException` | 400 | İş mantığı hatası (örn: hatalı OTP) |
| `UnauthorizedException` | 401 | Geçersiz veya eksik token |
| `IllegalStateException` | 500 | Yapılandırma hatası (örn: eksik API key) |
| `RuntimeException` | 502 | Harici servis hatası (örn: Gemini API) |

**Örnek Error Response**:
```json
{
  "error": "Validation failed",
  "details": [
    {"field": "childName", "message": "must not be blank"}
  ]
}
```

---

## Özet: Servisler ve Mapperlar Nerede?

### ✅ Servisler
- `auth/AuthService.java` → OTP, kullanıcı, token yönetimi
- `ai/GeminiAiService.java` → Google Gemini AI entegrasyonu

### ❌ Mapperlar
- **Ayrı mapper sınıfı yok**
- DTO'larda **static factory metodlar** var: `ChildResponse.fromEntity()`, `ExpenseResponse.fromEntity()`
- Bazı yerlerde **manuel constructor** kullanılıyor

### 📂 Diğer Katmanlar
- **Controllers**: `ai/`, `auth/`, `children/`, `expenses/`, `stats/`
- **Repositories**: `repository/` paketi (6 repository)
- **Entities**: `domain/` paketi (6 entity)
- **DTOs**: Her modülde `dto/` alt paketi

---

## Gelecek İyileştirmeler

1. **Service Katmanını Genişletme**:
   - `ChildService`, `ExpenseService`, `StatsService` ekle
   - Controller'lardaki iş mantığını servislere taşı

2. **Mapper Kütüphanesi**:
   - Eğer DTO-Entity dönüşümleri karmaşıklaşırsa **MapStruct** ekle

3. **Güvenlik**:
   - Spring Security entegrasyonu (şu anda basit token auth)
   - JWT token desteği

4. **Test Coverage**:
   - Unit testler (Service katmanı)
   - Integration testler (API endpoint'leri)

5. **Caching**:
   - Redis ile session token cache
   - Story generation cache (aynı parametreler)

6. **Async Processing**:
   - Hikaye üretimi için queue (RabbitMQ/Kafka)
   - Uzun süren AI istekleri için webhook callback

---

## Katkıda Bulunma

Mimari ile ilgili sorular veya iyileştirme önerileri için:
- Issue açın: GitHub Issues
- Dokümantasyon güncellemeleri için PR gönderin

**Son Güncelleme**: 2025-10-27
