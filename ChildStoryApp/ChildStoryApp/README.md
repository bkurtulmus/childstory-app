# DreamTales AI - Backend (v3.0)

**DreamTales AI** is an AI-powered platform that creates deeply personalized, multimodal bedtime stories for children ages 3-10. Version 3.0 introduces advanced features including enhanced child profiles, Quick/Creative story modes, interactive storytelling, series continuity, voice cloning, and tiered subscription management.

## Documentation
- MVP Plan (TR): docs/DreamTalesAI_MVP_TR.md
- Architecture & How It Works (TR): docs/ARCHITECTURE_TR.md
- Getting started with Spring Boot and related tech: see HELP.md

## Platform Overview (v3.0)

### Core Features
- **Deep Personalization**: Enhanced child profiles with likes, dislikes, fears, relationships (friends/family/pets)
- **Dual Generation Modes**: 
  - **Quick Mode**: AI auto-generates stories based on theme and profile
  - **Creative Mode**: Detailed custom prompts enriched with profile data
- **Behavioral Lessons**: Integrate educational themes (e.g., "sharing", "brushing teeth", "courage")
- **Fear Management**: AI addresses fears sensitively without triggering them
- **Multimodal Output**: Text stories, AI-generated images, TTS audio, video slideshows

### Premium Features (Subscription-Based)
- **Interactive Stories**: "Choose Your Own Adventure" with branching narratives
- **Series Stories**: Story continuity with AI remembering previous adventures
- **Voice Cloning**: Parent/grandparent voice narration for emotional connection
- **Family Sharing**: Secure sharing links for family members
- **Language Learning**: Contextual foreign language teaching within stories
- **Drawing Integration**: Post-story artwork capture and storage
- **PDF Export**: Download stories as printable keepsake books
- **Parent Dashboard**: Insights on themes and behavioral lessons covered

### Subscription Tiers
- **Free**: 1 story/day, 2 child profiles, Quick Mode only, standard quality
- **Premium Tiers** (e.g., "Dreamer", "Legendary"): Unlimited profiles, more daily stories, Creative Mode, HQ outputs, all premium features

## Running locally
Prerequisites:
- Java 21
- Maven 3.9+ (or use included Maven Wrapper)

Build:
- Windows (Maven Wrapper):
  - .\mvnw.cmd clean package
- Or with a local Maven installation:
  - mvn clean package

Run the app:
- .\mvnw.cmd spring-boot:run

Tests:
- .\mvnw.cmd test

## AI setup (Google Gemini)
- Set your Google AI Studio API key as an environment variable named GEMINI_API_KEY before running the app.
  - Windows PowerShell: $env:GEMINI_API_KEY = "YOUR_API_KEY"
- The default model is configured as gemini-2.5-flash (see src/main/resources/application.properties). You can change it via ai.gemini.model property.

## Auth: Phone number login (OTP)
- Request OTP (printed to server logs for MVP):
  - POST /api/auth/request-otp
  - Body: { "phoneNumber": "+905551112233" }
- Verify OTP (creates/returns a session token):
  - POST /api/auth/verify-otp
  - Body: { "phoneNumber": "+905551112233", "code": "123456", "displayName": "Arda" }
  - Response: { "token": "UUID", "userId": 1, "phoneNumber": "+905...", "displayName": "Arda", "premium": false }
- Use the token in requests via header: X-Auth-Token: <token>

## Children API (Enhanced Profile - v3.0)
- **GET /api/children** - List all child profiles for authenticated user
- **POST /api/children** - Create a new child profile with deep personalization
  ```json
  {
    "name": "Elif",
    "interests": "Uzay, dans",
    "birthDate": "2018-06-01",
    "likes": "{\"animals\":[\"Cats\"],\"colors\":[\"Blue\"],\"toys\":[\"Red Truck\"]}",
    "dislikes": "{\"foods\":[\"Broccoli\"],\"situations\":[\"Loud noises\"]}",
    "fears": "[\"Darkness\",\"Thunder\"]",
    "relationships": "{\"siblings\":[\"Ali\"],\"friends\":[\"Zeynep\"],\"pets\":[\"Boncuk\"]}",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
  ```
- **PUT /api/children/{id}** - Update child profile (partial updates supported)
  ```json
  {
    "name": "Elif",
    "likes": "{\"animals\":[\"Cats\",\"Dogs\"]}"
  }
  ```
- **DELETE /api/children/{id}** - Delete a child profile

## Expenses API
- GET /api/expenses
- POST /api/expenses { "amount": 39.90, "currency": "TRY", "category": "subscription", "description": "Aylık premium" }

## Stats API
- GET /api/stats/summary → { "childCount": 1, "expenseCount": 3, "totalExpense": 119.70, "storyGenerationCount": 5 }

## AI Story Generation Endpoint (v3.0)

### POST /api/ai/generate-story

Enhanced story generation with deep profile integration and advanced features.

**Request Headers:**
- `X-Auth-Token`: User authentication token (required)
- `Content-Type`: application/json

**Request Body (v3.0):**

**Field Descriptions:**
- `childProfileId` (Long, required): Child profile ID - AI uses full profile for personalization
- `mode` (String, required): "quick" or "creative"
- `theme` (String, optional): Story theme
- `lesson` (String, optional): Behavioral lesson to integrate
- `customPrompt` (String, optional): Detailed custom scenario (for creative mode)
- `isInteractive` (Boolean, optional): Enable branching "Choose Your Own Adventure" (Premium)
- `parentStoryId` (Long, optional): Continue from previous story (Premium - Series Stories)
- `enableLanguageLearning` (Boolean, optional): Add contextual language teaching (Premium)
- `learningLanguage` (String, optional): Target language (e.g., "English", "Spanish")
- `voiceCloneId` (Long, optional): Use parent/grandparent voice for narration (Premium)
- `generateSlideshow` (Boolean, optional): Create video/slideshow format (Premium)
- `quality` (String, optional): "standard" or "high" (Premium for high quality)

**Full Request Example:**
```json
{
  "childProfileId": 1,
  "mode": "quick",
  "theme": "Uzay",
  "lesson": "Paylaşmanın önemi",
  "customPrompt": "Elif parkta...",
  "isInteractive": false,
  "parentStoryId": null,
  "enableLanguageLearning": false,
  "learningLanguage": "English",
  "voiceCloneId": null,
  "generateSlideshow": false,
  "quality": "standard"
}
```

**Quick Mode Example:**
```json
{
  "childProfileId": 1,
  "mode": "quick",
  "theme": "Uzay macerası",
  "lesson": "Cesaret"
}
```

**Creative Mode Example:**
```json
{
  "childProfileId": 1,
  "mode": "creative",
  "customPrompt": "Elif parkta ıspanak yemeyi seven bir süper kahraman ile tanışıyor. Süper kahraman ona sebzelerin gücünü gösteriyor.",
  "lesson": "Sağlıklı beslenme"
}
```

**Interactive Story Example (Premium):**
```json
{
  "childProfileId": 1,
  "mode": "quick",
  "theme": "Orman",
  "isInteractive": true
}
```

**Series Story Example (Premium):**
```json
{
  "childProfileId": 1,
  "mode": "quick",
  "theme": "Uzay",
  "parentStoryId": 5,
  "lesson": "Cesaret"
}
```

**Response JSON (Multimodal - v3.0):**
```json
{
  "story": "Bir zamanlar, Elif adında cesur bir küçük kız vardı. Elif mavi renkli kıyafetleri ve kedi dostları ile ünlüydü. Bir gece, Elif ve kardeşi Ali, gökyüzünde parlayan yıldızlara bakarken, büyükanne anlattı onlara uzay hakkında. Elif hayal kurdu uzayda uçmayı. Uyumadan önce, Elif yıldızlara selam verdi ve gözlerini kapadı. Rüyasında, uzayda bir maceraya çıktı ve cesaretinin ödülünü aldı...",
  "imageUrls": [
    "https://storage.googleapis.com/dreamtales-ai-images/elif_stargazing_scene1_standard.jpg",
    "https://storage.googleapis.com/dreamtales-ai-images/elif_space_adventure_scene2_standard.jpg",
    "https://storage.googleapis.com/dreamtales-ai-images/elif_sleeping_peacefully_scene3_standard.jpg"
  ],
  "audioUrl": "https://storage.googleapis.com/dreamtales-ai-audio/story_123456789_tr-TR.mp3",
  "sceneDescriptions": [
    "Elif, mavi elbiseli küçük bir kız, kardeşi Ali ile birlikte bahçede yıldızlara bakıyor. Gökyüzü yıldızlarla dolu, sakin ve huzurlu bir gece. Çocuk kitabı illüstrasyonu tarzında, sıcak renkler.",
    "Elif uzayda, yıldızlar arasında uçuyor. Etrafında parlak gezegenler ve dostça gülümseyen bir kedi astronot. Renkli, neşeli, hayal gücü dolu bir sahne.",
    "Elif yatağında huzurla uyuyor, yüzünde gülümseme. Odası ay ışığıyla aydınlanmış, pencereden yıldızlar görünüyor. Sakinleştirici, yumuşak tonlarda bir resim."
  ]
}
```

**Response Fields:**
- `story` (String): The complete personalized story text in Turkish
- `imageUrls` (Array of Strings): URLs of generated scene images (3 for standard, 5 for high quality)
- `audioUrl` (String): URL of TTS audio narration of the story
- `sceneDescriptions` (Array of Strings): Detailed descriptions of each scene used for image generation (useful for debugging)
- `videoUrl` (String, optional): URL of slideshow/video format (if requested)

**How it works (Multimodal Generation):**
1. AI automatically retrieves the child profile (likes, dislikes, fears, relationships)
2. Builds sophisticated prompt integrating all profile data
3. In Quick Mode: AI auto-generates based on theme + profile
4. In Creative Mode: Enriches custom prompt with profile data
5. Handles fears sensitively (addresses but never triggers)
6. Integrates behavioral lessons naturally into the story
7. For series stories: Includes previous story context for continuity
8. For interactive stories: Creates branching choice points
9. **Uses Gemini AI to extract scene descriptions** from the generated story
10. **Generates images** for each scene using image generation API (Imagen)
11. **Generates audio narration** using Google Cloud Text-to-Speech API

**Legacy endpoint (backward compatible):**
```bash
curl -X POST http://localhost:8080/api/ai/generate-story \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: YOUR_TOKEN" \
  -d '{"childName":"Ece","theme":"Uzay","lesson":"Paylaşmak"}'
```

## Notes
- For local development an in-memory H2 DB is used; data resets on restart. To switch to Postgres, set spring.datasource.* to your Postgres instance and remove H2.
- The OTP code is printed to server logs instead of sending SMS (MVP/dev only). Use a real SMS provider in production.
