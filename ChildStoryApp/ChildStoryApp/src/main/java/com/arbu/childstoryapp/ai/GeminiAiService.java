package com.arbu.childstoryapp.ai;

import com.arbu.childstoryapp.ai.dto.GenerateStoryRequest;
import com.arbu.childstoryapp.domain.ChildProfile;
import com.arbu.childstoryapp.domain.Story;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

/**
 * Enhanced Gemini AI Service for DreamTales AI v3.0
 * Supports deep profile-based personalization, Quick/Creative modes, and advanced features
 */
@Service
public class GeminiAiService {

    @Value("${ai.gemini.model:gemini-2.5-flash}")
    private String modelName;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta")
            .build();

    public String getModelName() {
        return modelName;
    }

    /**
     * Legacy method - kept for backward compatibility
     * Generates a short bedtime story text using Google Gemini based on child name, theme and lesson.
     */
    public String generateStory(String childName, String theme, String lesson) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY environment variable is not set. Please set it to your Google AI Studio API key.");
        }

        String prompt = buildPrompt(childName, theme, lesson);

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", prompt))
                ))
        );

        try {
            JsonNode json = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/models/" + modelName + ":generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromValue(body))
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            String text = extractText(json);
            if (text == null || text.isBlank()) {
                throw new RuntimeException("Empty response from Gemini model");
            }
            return text.trim();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate story with Gemini: " + e.getMessage(), e);
        }
    }

    /**
     * Enhanced story generation for v3.0 with deep profile integration
     * Automatically integrates child profile data (likes, dislikes, fears, relationships)
     * Supports Quick/Creative modes, series continuity, and advanced features
     */
    public String generateStoryV3(GenerateStoryRequest request, ChildProfile childProfile, Story parentStory) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY environment variable is not set.");
        }

        String prompt = buildEnhancedPrompt(request, childProfile, parentStory);

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", prompt))
                ))
        );

        try {
            JsonNode json = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/models/" + modelName + ":generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromValue(body))
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            String text = extractText(json);
            if (text == null || text.isBlank()) {
                throw new RuntimeException("Empty response from Gemini model");
            }
            return text.trim();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate story with Gemini: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(String childName, String theme, String lesson) {
        return "You are DreamTales AI. Create a calm, age-appropriate, 6-8 sentence bedtime story in Turkish. " +
                "Personalize it for the child named '" + childName + "'. " +
                "Theme: " + theme + ". " +
                "Behavioral lesson to subtly teach: " + lesson + ". " +
                "Constraints: Simple vocabulary for ages 3-10, gentle tone, no scary elements, end with a positive, sleepy closure. " +
                "Only return the story text, no headings or markdown.";
    }

    /**
     * Builds sophisticated prompt with full profile integration for v3.0
     */
    private String buildEnhancedPrompt(GenerateStoryRequest request, ChildProfile childProfile, Story parentStory) {
        StringBuilder prompt = new StringBuilder();
        
        // System instruction
        prompt.append("You are DreamTales AI, an expert at creating personalized bedtime stories for children ages 3-10. ");
        prompt.append("Create a calm, soothing, age-appropriate story in Turkish.\n\n");

        // Profile information integration
        prompt.append("=== CHILD PROFILE ===\n");
        prompt.append("Hero Name: ").append(childProfile.getName()).append("\n");
        
        if (childProfile.getLikes() != null && !childProfile.getLikes().isBlank()) {
            prompt.append("Favorite Things (incorporate these naturally): ").append(childProfile.getLikes()).append("\n");
        }
        
        if (childProfile.getDislikes() != null && !childProfile.getDislikes().isBlank()) {
            prompt.append("Dislikes (avoid these): ").append(childProfile.getDislikes()).append("\n");
        }
        
        if (childProfile.getFears() != null && !childProfile.getFears().isBlank()) {
            prompt.append("Fears (IMPORTANT - address these sensitively if relevant, but NEVER trigger or scare): ");
            prompt.append(childProfile.getFears()).append("\n");
            prompt.append("If a fear is relevant to the story, help the child overcome it gently and supportively. Never make fears scary.\n");
        }
        
        if (childProfile.getRelationships() != null && !childProfile.getRelationships().isBlank()) {
            prompt.append("Supporting Characters (friends, siblings, pets - include these): ");
            prompt.append(childProfile.getRelationships()).append("\n");
        }

        prompt.append("\n=== STORY REQUIREMENTS ===\n");

        // Mode-specific instructions
        if ("creative".equalsIgnoreCase(request.getMode()) && request.getCustomPrompt() != null) {
            prompt.append("Mode: Creative (Detailed Custom)\n");
            prompt.append("User's Custom Scenario: ").append(request.getCustomPrompt()).append("\n");
            prompt.append("Enrich this scenario using the profile information above.\n");
        } else {
            prompt.append("Mode: Quick (AI Auto-Generate)\n");
            if (request.getTheme() != null) {
                prompt.append("Theme: ").append(request.getTheme()).append("\n");
            }
        }

        if (request.getLesson() != null && !request.getLesson().isBlank()) {
            prompt.append("Behavioral Lesson (weave subtly into the story): ").append(request.getLesson()).append("\n");
        }

        // Series continuity
        if (parentStory != null) {
            prompt.append("\n=== SERIES CONTINUITY ===\n");
            prompt.append("This is a continuation of a previous story. Previous story summary:\n");
            prompt.append(parentStory.getContent().substring(0, Math.min(500, parentStory.getContent().length())));
            prompt.append("...\nContinue the adventure naturally, referencing what happened before.\n");
        }

        // Language learning mode
        if (Boolean.TRUE.equals(request.getEnableLanguageLearning()) && request.getLearningLanguage() != null) {
            prompt.append("\n=== LANGUAGE LEARNING ===\n");
            prompt.append("Integrate simple ").append(request.getLearningLanguage()).append(" words with contextual teaching.\n");
            prompt.append("Example: 'The owl said, \"blue renge İngilizce'de 'blue' denir.\"'\n");
        }

        // Interactive mode
        if (Boolean.TRUE.equals(request.getIsInteractive())) {
            prompt.append("\n=== INTERACTIVE MODE ===\n");
            prompt.append("Create a branching story with 2 choice points. At each point, present 2 options.\n");
            prompt.append("Format: [CHOICE 1: Description] Option A: ... | Option B: ...\n");
        }

        // Constraints
        prompt.append("\n=== CONSTRAINTS ===\n");
        prompt.append("- Length: 8-12 sentences (longer if interactive)\n");
        prompt.append("- Vocabulary: Simple, for ages 3-10\n");
        prompt.append("- Tone: Calm, gentle, soothing, bedtime-appropriate\n");
        prompt.append("- NO scary elements, violence, or nightmares\n");
        prompt.append("- End with a peaceful, sleepy closure\n");
        prompt.append("- Make ").append(childProfile.getName()).append(" the hero/protagonist\n");
        prompt.append("- Only return the story text, no titles or markdown formatting\n");

        return prompt.toString();
    }

    private String extractText(JsonNode node) {
        if (node == null) return null;
        JsonNode candidates = node.get("candidates");
        if (candidates == null || !candidates.isArray() || candidates.isEmpty()) return null;
        JsonNode content = candidates.get(0).get("content");
        if (content == null) return null;
        JsonNode parts = content.get("parts");
        if (parts == null || !parts.isArray() || parts.isEmpty()) return null;
        JsonNode first = parts.get(0);
        if (first.has("text")) {
            return first.get("text").asText();
        }
        return null;
    }

    /**
     * MULTIMODAL GENERATION METHODS for v3.0
     * Uses Gemini AI for image prompt generation and scene analysis
     */

    /**
     * Generates scene descriptions from story text using Gemini
     * These descriptions will be used to generate images
     * 
     * @param storyText The complete story text
     * @param childName The child's name for personalization
     * @param sceneCount Number of scenes to extract (typically 3-5)
     * @return List of detailed scene descriptions suitable for image generation
     */
    public List<String> generateSceneDescriptions(String storyText, String childName, int sceneCount) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY environment variable is not set.");
        }

        String prompt = buildSceneDescriptionPrompt(storyText, childName, sceneCount);

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", prompt))
                ))
        );

        try {
            JsonNode json = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/models/" + modelName + ":generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromValue(body))
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            String text = extractText(json);
            if (text == null || text.isBlank()) {
                throw new RuntimeException("Empty response from Gemini for scene descriptions");
            }

            // Parse the response - expecting one description per line
            return List.of(text.trim().split("\n"))
                    .stream()
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .limit(sceneCount)
                    .toList();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate scene descriptions: " + e.getMessage(), e);
        }
    }

    /**
     * Generates an image using Gemini's Imagen API
     * Note: This is a placeholder for actual Imagen API integration
     * In production, this would call Google's Imagen API via vertex AI
     * 
     * @param sceneDescription Detailed description of the scene to generate
     * @param quality "standard" or "high"
     * @return URL of the generated image (placeholder in MVP)
     */
    public String generateImage(String sceneDescription, String quality) {
        // TODO: Implement actual Imagen API call
        // For now, return a placeholder URL that indicates image generation is pending
        // In production, this would call:
        // - Google Cloud Vertex AI Imagen API
        // - POST to https://REGION-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/REGION/publishers/google/models/imagegeneration:predict
        
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY environment variable is not set.");
        }

        // Placeholder implementation
        // Returns a mock URL - in production, this would be the actual generated image URL
        String sanitizedDescription = sceneDescription.replaceAll("[^a-zA-Z0-9]", "_").substring(0, Math.min(50, sceneDescription.length()));
        return "https://storage.googleapis.com/dreamtales-ai-images/" + sanitizedDescription + "_" + quality + ".jpg";
    }

    /**
     * Generates audio narration using Google Cloud Text-to-Speech
     * Note: This is a placeholder for actual TTS integration
     * In production, this would call Google Cloud TTS API
     * 
     * @param storyText The complete story text to narrate
     * @param languageCode Language code (e.g., "tr-TR" for Turkish)
     * @param voiceName Optional voice name (e.g., "tr-TR-Wavenet-A")
     * @return URL of the generated audio file (placeholder in MVP)
     */
    public String generateAudio(String storyText, String languageCode, String voiceName) {
        // TODO: Implement actual Google Cloud TTS API call
        // For now, return a placeholder URL that indicates audio generation is pending
        // In production, this would call:
        // - Google Cloud Text-to-Speech API
        // - POST to https://texttospeech.googleapis.com/v1/text:synthesize
        
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY environment variable is not set.");
        }

        // Placeholder implementation
        // Returns a mock URL - in production, this would be the actual generated audio URL
        String sanitizedText = String.valueOf(storyText.hashCode());
        return "https://storage.googleapis.com/dreamtales-ai-audio/story_" + sanitizedText + "_" + languageCode + ".mp3";
    }

    /**
     * Builds a prompt for extracting scene descriptions from a story
     */
    private String buildSceneDescriptionPrompt(String storyText, String childName, int sceneCount) {
        return "You are an expert at analyzing children's stories and creating detailed visual scene descriptions for image generation.\n\n" +
                "STORY TEXT:\n" +
                storyText + "\n\n" +
                "TASK: Extract " + sceneCount + " key visual scenes from this story. " +
                "For each scene, write a detailed, vivid description suitable for image generation. " +
                "Include:\n" +
                "- Main character (child named " + childName + ") appearance and action\n" +
                "- Setting and environment details\n" +
                "- Supporting characters or objects\n" +
                "- Mood and atmosphere (calm, warm, magical, etc.)\n" +
                "- Art style: children's book illustration, colorful, gentle, age-appropriate\n\n" +
                "CONSTRAINTS:\n" +
                "- Each description should be 2-3 sentences\n" +
                "- NO scary or dark elements\n" +
                "- Child-friendly, warm, inviting imagery\n" +
                "- One scene per line\n" +
                "- Do NOT number the scenes, just provide the descriptions\n\n" +
                "OUTPUT FORMAT: One scene description per line, no numbering, no extra formatting.";
    }
}
