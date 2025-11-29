package com.arbu.childstoryapp.children;

import com.arbu.childstoryapp.domain.ChildProfile;
import com.arbu.childstoryapp.repository.ChildProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChildService {

    private final ChildProfileRepository childRepo;

    public Optional<ChildProfile> getChildById(Long id) {
        return childRepo.findById(id);
    }

    public Optional<ChildProfile> getChildByIdAndUserId(Long id, Long userId) {
        return childRepo.findByIdAndUser_Id(id, userId);
    }

    @Transactional
    public ChildProfile addToWordBag(Long childId, Long userId, List<String> wordIds) {
        ChildProfile child = childRepo.findByIdAndUser_Id(childId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Child not found"));

        if (child.getWordBag() == null) {
            child.setWordBag(new java.util.HashSet<>());
        }

        child.getWordBag().addAll(wordIds);
        child.setWordsLearned(child.getWordBag().size());
        child.setLastQuestDate(Instant.now());
        
        // Update proficiency level based on words learned (simple logic for now)
        if (child.getWordsLearned() > 50) {
            child.setProficiencyLevel(ChildProfile.ProficiencyLevel.ADVANCED);
        } else if (child.getWordsLearned() > 20) {
            child.setProficiencyLevel(ChildProfile.ProficiencyLevel.INTERMEDIATE);
        } else {
            child.setProficiencyLevel(ChildProfile.ProficiencyLevel.BEGINNER);
        }

        return childRepo.save(child);
    }
}
