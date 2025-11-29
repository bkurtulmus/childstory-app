package com.arbu.childstoryapp.ai;

import com.arbu.childstoryapp.ai.dto.GenerateStoryRequest;
import com.arbu.childstoryapp.ai.dto.GenerateStoryResponse;
import com.arbu.childstoryapp.auth.AuthService;
import com.arbu.childstoryapp.common.UnauthorizedException;
import com.arbu.childstoryapp.domain.ChildProfile;
import com.arbu.childstoryapp.domain.Story;
import com.arbu.childstoryapp.domain.StoryGenerationLog;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.repository.ChildProfileRepository;
import com.arbu.childstoryapp.repository.StoryGenerationLogRepository;
import com.arbu.childstoryapp.repository.StoryRepository;
import com.arbu.childstoryapp.stories.StoryService;
import com.arbu.childstoryapp.stories.dto.CreateStoryRequest;
import com.arbu.childstoryapp.subscriptions.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * AI Controller for DreamTales AI v3.0
 * Orchestrates multimodal story generation: text, images, and audio
 */
@RestController
@RequestMapping("/api/ai")
@Validated
public class AiController {

    private final GeminiAiService geminiAiService;
    private final AuthService authService;
    private final ChildProfileRepository childRepo;
    private final StoryGenerationLogRepository storyLogRepo;
    private final StoryRepository storyRepo;
    private final StoryService storyService;
    private final SubscriptionService subscriptionService;

    public AiController(GeminiAiService geminiAiService,
                        AuthService authService,
                        ChildProfileRepository childRepo,
                        StoryGenerationLogRepository storyLogRepo,
                        StoryRepository storyRepo,
                        StoryService storyService,
                        SubscriptionService subscriptionService) {
        this.geminiAiService = geminiAiService;
        this.authService = authService;
        this.childRepo = childRepo;
        this.storyLogRepo = storyLogRepo;
        this.storyRepo = storyRepo;
        this.storyService = storyService;
        this.subscriptionService = subscriptionService;
    }

    /**
     * Enhanced multimodal story generation endpoint for v3.0
     * Generates story text, scene images, and audio narration using Gemini AI
     */
    @PostMapping("/generate-story")
    public ResponseEntity<GenerateStoryResponse> generateStory(
            @RequestHeader(value = "X-Auth-Token", required = false) String token,
            @Valid @RequestBody GenerateStoryRequest request) {

        // Authenticate user
        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        // Check subscription limits (v3.0 enhancement)
        if (!subscriptionService.canGenerateStory(user.getId())) {
            throw new IllegalStateException("Daily story limit reached. Please upgrade your subscription or try again tomorrow.");
        }

        // Load child profile
        ChildProfile childProfile = childRepo.findByIdAndUser_Id(request.getChildProfileId(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Child profile not found or does not belong to user"));

        // Load parent story if this is a series continuation
        Story parentStory = null;
        if (request.getParentStoryId() != null) {
            parentStory = storyRepo.findByIdAndUser_Id(request.getParentStoryId(), user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent story not found or does not belong to user"));
        }

        // Step 1: Generate story text using enhanced v3.0 method
        String storyText = geminiAiService.generateStoryV3(request, childProfile, parentStory);

        // Step 2: Generate scene descriptions using Gemini
        List<String> sceneDescriptions = new ArrayList<>();
        List<String> imageUrls = new ArrayList<>();
        String audioUrl = null;

        // Determine if we should generate images and audio (based on request or subscription level)
        boolean generateImages = shouldGenerateImages(request);
        boolean generateAudio = shouldGenerateAudio(request);

        if (generateImages) {
            try {
                // Use Gemini to extract scene descriptions from the story
                int sceneCount = determineSceneCount(request);
                sceneDescriptions = geminiAiService.generateSceneDescriptions(
                        storyText, 
                        childProfile.getName(), 
                        sceneCount
                );

                // Generate an image for each scene description
                String quality = request.getQuality() != null ? request.getQuality() : "standard";
                for (String sceneDesc : sceneDescriptions) {
                    String imageUrl = geminiAiService.generateImage(sceneDesc, quality);
                    imageUrls.add(imageUrl);
                }
            } catch (Exception e) {
                // Log error but don't fail the entire request
                System.err.println("Failed to generate images: " + e.getMessage());
            }
        }

        if (generateAudio) {
            try {
                // Generate audio narration using TTS
                String languageCode = "tr-TR"; // Turkish by default
                String voiceName = determineVoiceName(request);
                audioUrl = geminiAiService.generateAudio(storyText, languageCode, voiceName);
            } catch (Exception e) {
                // Log error but don't fail the entire request
                System.err.println("Failed to generate audio: " + e.getMessage());
            }
        }

        // Step 3: Log the generation for statistics
        StoryGenerationLog log = new StoryGenerationLog();
        log.setUser(user);
        log.setChild(childProfile);
        log.setTheme(request.getTheme());
        log.setLesson(request.getLesson());
        log.setModel(geminiAiService.getModelName());
        log.setCreatedAt(Instant.now());
        storyLogRepo.save(log);

        // Step 4: Build and return the response
        GenerateStoryResponse response = new GenerateStoryResponse(storyText, imageUrls, audioUrl);
        if (!sceneDescriptions.isEmpty()) {
            response.setSceneDescriptions(sceneDescriptions);
        }

        // Step 5: Save the story to database (v3.0 enhancement)
        try {
            CreateStoryRequest createStoryRequest = new CreateStoryRequest();
            createStoryRequest.setChildProfileId(childProfile.getId());
            createStoryRequest.setTitle(generateStoryTitle(childProfile.getName(), request.getTheme()));
            createStoryRequest.setContent(storyText);
            createStoryRequest.setImageUrls(imageUrls);
            createStoryRequest.setAudioUrl(audioUrl);
            createStoryRequest.setMode(request.getMode() != null ? request.getMode() : "quick");
            createStoryRequest.setTheme(request.getTheme());
            createStoryRequest.setIsInteractive(false); // TODO: Set based on request when interactive mode is implemented
            createStoryRequest.setParentStoryId(request.getParentStoryId());

            Story savedStory = storyService.saveStory(createStoryRequest, user);
            response.setStoryId(savedStory.getId());
            
            // Increment story generation counter (v3.0 enhancement)
            subscriptionService.incrementStoryCount(user.getId());
        } catch (Exception e) {
            // Log error but don't fail the request - story generation was successful
            System.err.println("Failed to save story to database: " + e.getMessage());
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Determines if images should be generated based on request parameters
     * In production, this would also check user's subscription level
     */
    private boolean shouldGenerateImages(GenerateStoryRequest request) {
        // For now, always generate images
        // In production, check: user.getSubscription().hasImageGeneration()
        return true;
    }

    /**
     * Determines if audio should be generated based on request parameters
     * In production, this would also check user's subscription level
     */
    private boolean shouldGenerateAudio(GenerateStoryRequest request) {
        // For now, always generate audio
        // In production, check: user.getSubscription().hasAudioGeneration()
        return true;
    }

    /**
     * Determines how many scenes/images to generate based on request and subscription
     */
    private int determineSceneCount(GenerateStoryRequest request) {
        // Standard: 3 scenes, High quality: 5 scenes
        if ("high".equalsIgnoreCase(request.getQuality())) {
            return 5;
        }
        return 3;
    }

    /**
     * Determines voice name for TTS based on voice clone ID or default
     */
    private String determineVoiceName(GenerateStoryRequest request) {
        // TODO: If voiceCloneId is provided, load the voice clone data and use custom voice
        // For now, use default Turkish voice
        return "tr-TR-Wavenet-A";
    }

    /**
     * Generate a story title from child name and theme
     * Format: "{ChildName}'in {Theme} Macerası" or "{ChildName}'s {Theme} Adventure"
     */
    private String generateStoryTitle(String childName, String theme) {
        if (theme == null || theme.isEmpty()) {
            return childName + "'in Uyku Vakti Hikayesi";
        }
        // Capitalize first letter of theme
        String capitalizedTheme = theme.substring(0, 1).toUpperCase() + theme.substring(1);
        return childName + "'in " + capitalizedTheme + " Macerası";
    }
}
