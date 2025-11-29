package com.arbu.childstoryapp.stories;

import com.arbu.childstoryapp.domain.ChildProfile;
import com.arbu.childstoryapp.domain.Story;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.repository.ChildProfileRepository;
import com.arbu.childstoryapp.repository.StoryRepository;
import com.arbu.childstoryapp.stories.dto.CreateStoryRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Story Service for DreamTales AI v3.0
 * Handles story CRUD operations, favorites, sharing, and series management
 */
@Service
public class StoryService {

    private final StoryRepository storyRepo;
    private final ChildProfileRepository childRepo;
    private final com.arbu.childstoryapp.repository.StoryPageRepository storyPageRepo;
    private final com.arbu.childstoryapp.language.LanguageService languageService;

    public StoryService(StoryRepository storyRepo, ChildProfileRepository childRepo,
                        com.arbu.childstoryapp.repository.StoryPageRepository storyPageRepo,
                        com.arbu.childstoryapp.language.LanguageService languageService) {
        this.storyRepo = storyRepo;
        this.childRepo = childRepo;
        this.storyPageRepo = storyPageRepo;
        this.languageService = languageService;
    }

    /**
     * Save a new story
     * Called by AiController after story generation
     */
    @Transactional
    public Story saveStory(CreateStoryRequest request, UserAccount user) {
        // Validate child profile belongs to user
        ChildProfile childProfile = childRepo.findByIdAndUser_Id(request.getChildProfileId(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Child profile not found or does not belong to user"));

        Story story = new Story();
        story.setUser(user);
        story.setChild(childProfile);
        story.setTitle(request.getTitle());
        String content = request.getContent();
        story.setContent(content);
        story.setMode(request.getMode());
        story.setTheme(request.getTheme());
        story.setIsInteractive(request.getIsInteractive() != null ? request.getIsInteractive() : false);
        story.setIsFavorite(false); // Default to not favorite
        story.setAudioUrl(request.getAudioUrl());
        story.setVideoUrl(request.getVideoUrl());
        story.setUserDrawingUrl(request.getUserDrawingUrl());

        // Convert imageUrls List to JSON string
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            story.setImageUrls(serializeImageUrls(request.getImageUrls()));
            // Set the first image as the thumbnail
            story.setThumbnail(request.getImageUrls().get(0));
        }

        // Handle parent story for series
        if (request.getParentStoryId() != null) {
            Story parentStory = storyRepo.findByIdAndUser_Id(request.getParentStoryId(), user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent story not found or does not belong to user"));
            story.setParentStory(parentStory);
        }

        story.setCreatedAt(Instant.now());
        story.setUpdatedAt(Instant.now());
        
        // --- Language Learning Logic ---
        if (Boolean.TRUE.equals(childProfile.getLanguageLearningEnabled())) {
            // 1. Get random words (mock logic for now, picking 3 random words)
            List<com.arbu.childstoryapp.domain.LanguageWord> allWords = languageService.getAllWords();
            if (!allWords.isEmpty()) {
                java.util.Collections.shuffle(allWords);
                List<com.arbu.childstoryapp.domain.LanguageWord> selectedWords = allWords.stream().limit(3).toList();
                
                List<String> questWordIds = selectedWords.stream().map(com.arbu.childstoryapp.domain.LanguageWord::getId).toList();
                story.setQuestWordIds(questWordIds);
                story.setTotalVocabularyWords(questWordIds.size()); // Simplified for now

                // 2. Inject words into content (simple replacement)
                // Note: This is a basic implementation. A real one would need NLP to match context/grammar.
                // We are just replacing exact matches of the English translation with the Spanish word in brackets.
                // e.g. "tree" -> "[árbol]"
                // But wait, our LanguageWord has 'word' (foreign) and 'translation' (native).
                // If the story is in English, we replace English words (translation) with Foreign words (word).
                
                // We'll do this replacement when creating StoryPages
            }
        }

        Story savedStory = storyRepo.save(story);

        // --- Create Story Pages ---
        // Split content by double newlines to create pages
        String[] pageTexts = content.split("\n\n");
        int pageNum = 1;
        
        for (String pageText : pageTexts) {
            if (pageText.trim().isEmpty()) continue;

            com.arbu.childstoryapp.domain.StoryPage page = new com.arbu.childstoryapp.domain.StoryPage();
            page.setStory(savedStory);
            page.setPageNumber(pageNum++);
            page.setText(pageText.trim());
            
            // Generate textWithLanguage
            String textWithLanguage = pageText.trim();
            List<String> pageVocabIds = new java.util.ArrayList<>();
            
            if (Boolean.TRUE.equals(childProfile.getLanguageLearningEnabled()) && story.getQuestWordIds() != null) {
                List<com.arbu.childstoryapp.domain.LanguageWord> questWords = languageService.getWordsByIds(story.getQuestWordIds());
                
                for (com.arbu.childstoryapp.domain.LanguageWord word : questWords) {
                    // Case-insensitive replacement of the English translation
                    // This is very naive and might replace parts of other words, but sufficient for MVP
                    String target = word.getTranslation(); // e.g. "tree"
                    String replacement = "[" + word.getWord() + "]"; // e.g. "[árbol]"
                    
                    if (textWithLanguage.toLowerCase().contains(target.toLowerCase())) {
                        // Use regex to replace whole words only
                        textWithLanguage = textWithLanguage.replaceAll("(?i)\\b" + java.util.regex.Pattern.quote(target) + "\\b", replacement);
                        if (!pageVocabIds.contains(word.getId())) {
                            pageVocabIds.add(word.getId());
                        }
                    }
                }
            }
            
            page.setTextWithLanguage(textWithLanguage);
            page.setVocabularyWordIds(pageVocabIds);
            
            // Assign image URL if available (distribute images across pages)
            if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
                int imageIndex = (pageNum - 2) % request.getImageUrls().size(); // 0-indexed
                if (imageIndex >= 0 && imageIndex < request.getImageUrls().size()) {
                    page.setImageUrl(request.getImageUrls().get(imageIndex));
                }
            }

            storyPageRepo.save(page);
        }

        return savedStory;
    }

    /**
     * Get all stories for a user
     */
    @Transactional(readOnly = true)
    public List<Story> getUserStories(Long userId) {
        return storyRepo.findByUser_IdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get favorite stories for a user
     */
    @Transactional(readOnly = true)
    public List<Story> getFavoriteStories(Long userId) {
        return storyRepo.findByUser_IdAndIsFavoriteTrueOrderByCreatedAtDesc(userId);
    }

    /**
     * Get a specific story by ID (must belong to user)
     */
    @Transactional(readOnly = true)
    public Optional<Story> getStoryById(Long storyId, Long userId) {
        return storyRepo.findByIdAndUser_Id(storyId, userId);
    }

    /**
     * Toggle favorite status of a story
     */
    @Transactional
    public Story toggleFavorite(Long storyId, Long userId) {
        Story story = storyRepo.findByIdAndUser_Id(storyId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found or does not belong to user"));

        story.setIsFavorite(!Boolean.TRUE.equals(story.getIsFavorite()));
        story.setUpdatedAt(Instant.now());

        return storyRepo.save(story);
    }

    /**
     * Toggle upvote status of a story (Social Proof)
     */
    @Transactional
    public Story toggleUpvote(Long storyId) {
        Story story = storyRepo.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        // Simple increment/decrement logic (in a real app, track user upvotes to prevent duplicates)
        // For now, we just increment
        if (story.getUpvotes() == null) story.setUpvotes(0);
        story.setUpvotes(story.getUpvotes() + 1);
        
        return storyRepo.save(story);
    }

    /**
     * Generate a share token for family sharing
     * Returns the updated story with shareToken
     */
    @Transactional
    public Story generateShareToken(Long storyId, Long userId) {
        Story story = storyRepo.findByIdAndUser_Id(storyId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found or does not belong to user"));

        // Generate a unique share token
        String shareToken = UUID.randomUUID().toString();
        story.setShareToken(shareToken);
        story.setUpdatedAt(Instant.now());

        return storyRepo.save(story);
    }

    /**
     * Get a story by share token (for family viewing)
     * No user authentication required
     */
    @Transactional(readOnly = true)
    public Optional<Story> getSharedStory(String shareToken) {
        return storyRepo.findByShareToken(shareToken);
    }

    /**
     * Delete a story
     */
    @Transactional
    public void deleteStory(Long storyId, Long userId) {
        Story story = storyRepo.findByIdAndUser_Id(storyId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found or does not belong to user"));

        storyRepo.delete(story);
    }

    /**
     * Update user drawing URL for a story
     */
    @Transactional
    public Story updateUserDrawing(Long storyId, Long userId, String drawingUrl) {
        Story story = storyRepo.findByIdAndUser_Id(storyId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found or does not belong to user"));

        story.setUserDrawingUrl(drawingUrl);
        story.setUpdatedAt(Instant.now());

        return storyRepo.save(story);
    }

    /**
     * Get series stories (children of a parent story)
     */
    @Transactional(readOnly = true)
    public List<Story> getSeriesStories(Long parentStoryId, Long userId) {
        // First verify parent story belongs to user
        storyRepo.findByIdAndUser_Id(parentStoryId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Parent story not found or does not belong to user"));

        return storyRepo.findByParentStory_IdOrderByCreatedAtAsc(parentStoryId);
    }

    /**
     * Serialize List<String> to JSON array format
     * ["url1", "url2", "url3"]
     */
    private String serializeImageUrls(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return null;
        }

        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < imageUrls.size(); i++) {
            json.append("\"").append(imageUrls.get(i).replace("\"", "\\\"")).append("\"");
            if (i < imageUrls.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");

        return json.toString();
    }

    /**
     * Get explore stories (hardcoded templates)
     */
    public List<Story> getExploreStories() {
        List<Story> templates = new ArrayList<>();
        
        // Template 1: Space - Leo's Galactic Mission
        templates.add(createTemplate(
            1L, "Leo's Galactic Mission", "Space", "Leo",
            List.of(
                "Leo was a brave astronaut floating through space.",
                "One day, Leo saw a sad little star crying in the dark.",
                "The star had lost its way home to the Milky Way.",
                "Leo gently picked up the star and held it close.",
                "Together, they flew past colorful planets and moons.",
                "Finally, they reached the star's family in the galaxy.",
                "The stars twinkled with joy and thanked Leo.",
                "Leo waved goodbye and continued exploring the cosmos."
            ),
            "assets/images/characters/astronaut_idle.png",
            "assets/images/stories/story_1_thumbnail.png",
            "5 min", 150, "Adventurous"
        ));
        
        // Template 2: Adventure - Max the Brave Knight
        templates.add(createTemplate(
            2L, "Max the Brave Knight", "Adventure", "Max",
            List.of(
                "Max was a brave knight who lived in a grand castle.",
                "One morning, Max heard about the legendary Golden Shield.",
                "It was hidden deep in the Enchanted Forest.",
                "Max put on shining armor and set off on the quest.",
                "In the forest, Max met a friendly owl who gave directions.",
                "After crossing a river and climbing a hill, Max found a cave.",
                "Inside the cave, the Golden Shield glowed brightly.",
                "Max took the shield and returned home as a hero."
            ),
            "assets/images/characters/knight_idle.png",
            "assets/images/stories/story_2_thumbnail.png",
            "5 min", 200, "Heroic"
        ));
        
        // Template 3: Magic - The Enchanted Forest
        templates.add(createTemplate(
            3L, "The Enchanted Forest", "Magic", "Oliver",
            List.of(
                "Deep in the woods, there was a magical tree named Willow.",
                "Willow had lost its magic and couldn't bloom anymore.",
                "Oliver, a wise owl, heard about Willow's problem.",
                "Oliver flew to the tree and asked what was wrong.",
                "Willow said it needed the light of a thousand fireflies.",
                "Oliver called all the fireflies in the forest.",
                "They surrounded Willow, and the tree began to glow.",
                "Willow bloomed with beautiful golden flowers, and the forest was magical again."
            ),
            "assets/images/characters/owl_idle.png",
            "assets/images/stories/story_3_thumbnail.png",
            "6 min", 120, "Magical"
        ));
        
        // Template 4: Animals - Oliver the Wise Owl
        templates.add(createTemplate(
            4L, "Oliver the Wise Owl", "Animals", "Oliver",
            List.of(
                "Oliver was the smartest owl in the forest.",
                "One day, the forest animals came to Oliver with a mystery.",
                "All the acorns had disappeared from the oak trees!",
                "Oliver put on thinking feathers and investigated.",
                "Oliver found tiny footprints leading to a hollow log.",
                "Inside, a family of squirrels was storing acorns for winter.",
                "Oliver explained that sharing is important.",
                "The squirrels agreed to share, and everyone was happy."
            ),
            "assets/images/characters/owl_thinking.png",
            "assets/images/backgrounds/forest_bg.png",
            "5 min", 95, "Wise"
        ));
        
        // Template 5: Fairy Tales - The Kingdom of Dreams
        templates.add(createTemplate(
            5L, "The Kingdom of Dreams", "Fairy Tales", "Max",
            List.of(
                "In a kingdom far away, everyone loved to dream.",
                "But one day, the Dream Bell stopped ringing.",
                "Without the bell, no one could have sweet dreams.",
                "Max, a brave knight, volunteered to fix the bell.",
                "Max climbed the tallest tower in the kingdom.",
                "At the top, Max found a sleepy dragon sitting on the bell.",
                "Max gently woke the dragon and asked it to move.",
                "The dragon yawned, moved aside, and the Dream Bell rang again!"
            ),
            "assets/images/characters/knight_victory.png",
            "assets/images/backgrounds/castle_bg.png",
            "6 min", 180, "Dreamy"
        ));
        
        return templates;
    }
    
    private Story createTemplate(Long id, String title, String category, String characterName,
                                List<String> pageTexts, String characterImage, String backgroundImage,
                                String duration, Integer upvotes, String tone) {
        Story story = new Story();
        story.setId(id);
        story.setTitle(title);
        story.setCategory(category);
        story.setThumbnail(backgroundImage);
        story.setDuration(duration);
        story.setUpvotes(upvotes);
        story.setTheme(tone);
        story.setCreatedAt(Instant.now());
        story.setUpdatedAt(Instant.now());
        story.setIsFavorite(false);
        story.setIsStaffPick(id <= 2); // First 2 stories are staff picks
        
        // Store character name for personalization
        story.setChildName(characterName);
        
        // Create pages
        List<com.arbu.childstoryapp.domain.StoryPage> pages = new ArrayList<>();
        StringBuilder contentBuilder = new StringBuilder("[");
        for (int i = 0; i < pageTexts.size(); i++) {
            com.arbu.childstoryapp.domain.StoryPage page = new com.arbu.childstoryapp.domain.StoryPage();
            page.setPageNumber(i + 1);
            page.setText(pageTexts.get(i));
            page.setImageUrl(backgroundImage);
            page.setStory(story);
            pages.add(page);
            
            // Build JSON content
            if (i > 0) contentBuilder.append(",");
            contentBuilder.append("{\"pageNumber\":").append(i + 1)
                .append(",\"text\":\"").append(pageTexts.get(i).replace("\"", "\\\""))
                .append("\",\"imageUrl\":\"").append(backgroundImage).append("\"}");
        }
        contentBuilder.append("]");
        story.setPages(pages);
        story.setContent(contentBuilder.toString());
        
        return story;
    }
    
    /**
     * Personalize a template story for a specific child
     */
    @Transactional
    public Story personalizeStory(Long templateId, Long childId, Long userId) {
        // Get template
        List<Story> templates = getExploreStories();
        Story template = templates.stream()
            .filter(s -> s.getId().equals(templateId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Template story not found"));
        
        // Get child profile
        ChildProfile child = childRepo.findByIdAndUser_Id(childId, userId)
            .orElseThrow(() -> new IllegalArgumentException("Child profile not found"));
        
        // Create new story
        Story newStory = new Story();
        newStory.setUser(child.getUser());
        newStory.setChild(child);
        newStory.setCategory(template.getCategory());
        newStory.setThumbnail(template.getThumbnail());
        newStory.setDuration(template.getDuration());
        newStory.setTheme(template.getTheme());
        newStory.setCreatedAt(Instant.now());
        newStory.setUpdatedAt(Instant.now());
        newStory.setIsFavorite(false);
        newStory.setUpvotes(0);
        
        // Replace character name in title
        String templateName = template.getChildName();
        String childName = child.getName();
        newStory.setTitle(template.getTitle().replace(templateName, childName));
        newStory.setChildName(childName);
        
        // Create pages and build content
        List<com.arbu.childstoryapp.domain.StoryPage> newPages = new ArrayList<>();
        StringBuilder contentBuilder = new StringBuilder("[");
        int pageIndex = 0;
        
        for (com.arbu.childstoryapp.domain.StoryPage templatePage : template.getPages()) {
            com.arbu.childstoryapp.domain.StoryPage newPage = new com.arbu.childstoryapp.domain.StoryPage();
            newPage.setStory(newStory);
            newPage.setPageNumber(templatePage.getPageNumber());
            
            // Determine background asset based on category
            String backgroundAsset = "assets/images/backgrounds/forest_bg.png"; // Default
            String category = template.getCategory();
            if (category != null) {
                if (category.contains("Space")) {
                    backgroundAsset = "assets/images/backgrounds/space_bg.png";
                } else if (category.contains("Pirate") || category.contains("Adventure")) {
                    backgroundAsset = "assets/images/backgrounds/castle_bg.png";
                } else if (category.contains("Bedtime")) {
                    backgroundAsset = "assets/images/backgrounds/bedroom_bg.png";
                }
            }
            newPage.setImageUrl(backgroundAsset);
            
            // Replace character name in text
            String personalizedText = templatePage.getText().replace(templateName, childName);
            newPage.setText(personalizedText);
            
            newPages.add(newPage);
            
            // Build JSON content
            if (pageIndex > 0) contentBuilder.append(",");
            contentBuilder.append("{\"pageNumber\":").append(templatePage.getPageNumber())
                .append(",\"text\":\"").append(personalizedText.replace("\"", "\\\""))
                .append("\",\"imageUrl\":\"").append(templatePage.getImageUrl()).append("\"}");
            pageIndex++;
        }
        contentBuilder.append("]");
        
        newStory.setPages(newPages);
        newStory.setContent(contentBuilder.toString());
        
        // Save story (cascades to pages)
        newStory = storyRepo.save(newStory);
        
        return newStory;
    }
}
