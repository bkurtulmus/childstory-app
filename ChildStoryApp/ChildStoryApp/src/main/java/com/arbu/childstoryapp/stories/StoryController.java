package com.arbu.childstoryapp.stories;

import com.arbu.childstoryapp.auth.AuthService;
import com.arbu.childstoryapp.common.UnauthorizedException;
import com.arbu.childstoryapp.domain.Story;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.stories.dto.StoryListResponse;
import com.arbu.childstoryapp.stories.dto.StoryResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Story Controller for DreamTales AI v3.0
 * Manages user's story library, favorites, sharing, and series
 */
@RestController
@RequestMapping("/api/stories")
public class StoryController {

    private final StoryService storyService;
    private final AuthService authService;
    private final com.arbu.childstoryapp.credits.StoryAccessService storyAccessService;

    public StoryController(StoryService storyService, AuthService authService, com.arbu.childstoryapp.credits.StoryAccessService storyAccessService) {
        this.storyService = storyService;
        this.authService = authService;
        this.storyAccessService = storyAccessService;
    }

    /**
     * GET /api/stories
     * Get all stories for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<StoryListResponse>> getUserStories(
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        List<Story> stories = storyService.getUserStories(user.getId());
        List<StoryListResponse> response = stories.stream()
                .map(StoryListResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/stories/favorites
     * Get all favorite stories for the authenticated user
     */
    @GetMapping("/favorites")
    public ResponseEntity<List<StoryListResponse>> getFavoriteStories(
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        List<Story> stories = storyService.getFavoriteStories(user.getId());
        List<StoryListResponse> response = stories.stream()
                .map(StoryListResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/stories/{id}
     * Get a specific story by ID (with full content)
     */
    @GetMapping("/{id}")
    public ResponseEntity<StoryResponse> getStoryById(
            @PathVariable Long id,
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        Story story = storyService.getStoryById(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        return ResponseEntity.ok(StoryResponse.fromEntity(story));
    }

    /**
     * POST /api/stories/{id}/favorite
     * Toggle favorite status of a story
     */
    @PostMapping("/{id}/favorite")
    public ResponseEntity<StoryResponse> toggleFavorite(
            @PathVariable Long id,
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        Story story = storyService.toggleFavorite(id, user.getId());

        return ResponseEntity.ok(StoryResponse.fromEntity(story));
    }

    /**
     * POST /api/stories/{id}/upvote
     * Toggle upvote status of a story
     */
    @PostMapping("/{id}/upvote")
    public ResponseEntity<StoryResponse> toggleUpvote(
            @PathVariable Long id,
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        Story story = storyService.toggleUpvote(id);

        return ResponseEntity.ok(StoryResponse.fromEntity(story));
    }

    /**
     * POST /api/stories/{id}/share
     * Generate a secure share token for family sharing
     */
    @PostMapping("/{id}/share")
    public ResponseEntity<Map<String, String>> generateShareLink(
            @PathVariable Long id,
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        Story story = storyService.generateShareToken(id, user.getId());

        Map<String, String> response = new HashMap<>();
        response.put("shareToken", story.getShareToken());
        response.put("shareUrl", "/api/stories/shared/" + story.getShareToken());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/stories/shared/{shareToken}
     * View a shared story (no authentication required)
     */
    @GetMapping("/shared/{shareToken}")
    public ResponseEntity<StoryResponse> getSharedStory(@PathVariable String shareToken) {

        Story story = storyService.getSharedStory(shareToken)
                .orElseThrow(() -> new IllegalArgumentException("Shared story not found or token invalid"));

        return ResponseEntity.ok(StoryResponse.fromEntity(story));
    }

    /**
     * DELETE /api/stories/{id}
     * Delete a story
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStory(
            @PathVariable Long id,
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        storyService.deleteStory(id, user.getId());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Story deleted successfully");

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/stories/{id}/series
     * Get all stories in a series (continuation stories)
     */
    @GetMapping("/{id}/series")
    public ResponseEntity<List<StoryListResponse>> getSeriesStories(
            @PathVariable Long id,
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        List<Story> stories = storyService.getSeriesStories(id, user.getId());
        List<StoryListResponse> response = stories.stream()
                .map(StoryListResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/stories/{id}/drawing
     * Update user drawing for a story
     */
    @PutMapping("/{id}/drawing")
    public ResponseEntity<StoryResponse> updateUserDrawing(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody,
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        String drawingUrl = requestBody.get("drawingUrl");
        if (drawingUrl == null || drawingUrl.isEmpty()) {
            throw new IllegalArgumentException("drawingUrl is required");
        }

        Story story = storyService.updateUserDrawing(id, user.getId(), drawingUrl);

        return ResponseEntity.ok(StoryResponse.fromEntity(story));
    }

    /**
     * GET /api/stories/explore
     * Get pre-made story templates for the Explore section
     */
    @GetMapping("/explore")
    public ResponseEntity<List<StoryListResponse>> getExploreStories() {
        List<Story> templates = storyService.getExploreStories();
        List<StoryListResponse> response = templates.stream()
                .map(StoryListResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/stories/personalize/{templateId}
     * Personalize a template story for a specific child
     */
    @PostMapping("/personalize/{templateId}")
    public ResponseEntity<StoryResponse> personalizeStory(
            @PathVariable Long templateId,
            @RequestBody Map<String, Long> requestBody,
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        Long childId = requestBody.get("childId");
        if (childId == null) {
            throw new IllegalArgumentException("childId is required");
        }

        // Check if template requires credits
        Story template = storyService.getStoryById(templateId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Template not found"));
        
        if (template.getPersonalizationCost() != null && template.getPersonalizationCost() > 0) {
            // Premium template - deduct credits
            try {
                storyAccessService.unlockWithCredits(user.getId());
            } catch (IllegalStateException e) {
                throw new IllegalStateException("Insufficient credits to personalize this template");
            }
        }

        Story story = storyService.personalizeStory(templateId, childId, user.getId());

        return ResponseEntity.ok(StoryResponse.fromEntity(story));
    }

    /**
     * POST /api/stories/check-access
     * Check if user can create a story (daily limit check)
     */
    @PostMapping("/check-access")
    public ResponseEntity<com.arbu.childstoryapp.credits.StoryAccessStatus> checkAccess(
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        return ResponseEntity.ok(storyAccessService.checkAccess(user.getId()));
    }

    /**
     * POST /api/stories/unlock
     * Unlock additional story slot with credits
     */
    @PostMapping("/unlock")
    public ResponseEntity<Map<String, Object>> unlockStory(
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        storyAccessService.unlockWithCredits(user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Story unlocked successfully");

        return ResponseEntity.ok(response);
    }
}
