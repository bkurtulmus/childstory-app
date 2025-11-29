# PowerShell script to batch update all components to responsive width
# This replaces fixed 390px width with responsive container

$files = @(
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/VerifyOTP.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/VoiceCloning.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/SubscriptionStatus.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/SubscriptionPlans.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/StorySeriesView.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/StoryResult.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/StoryCreate.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/StoriesLibraryEnhanced.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/StoriesLibrary.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/StatsDashboard.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/Settings.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/SharedStoryView.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/LoadingStates.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/FavoritesScreen.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/Expenses.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/ErrorStates.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/EmptyStates.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/ChoicesHistory.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/ChildrenList.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/ChildEdit.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/ChildCreate.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/Checkout.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/AddEditExpense.tsx",
    "c:/Users/user/Downloads/ChildStory - Kopya/Splash Screen Design (Copy) (1)/src/components/HomeDashboard.tsx"
)

$count = 0
foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Replace fixed width/height with responsive
        $content = $content -replace "width:\s*'390px',\s*\r?\n\s*height:\s*'844px',", "width: '100%',`r`n        maxWidth: 'var(--container-max-width)',`r`n        minHeight: '100vh',"
        
        # Also handle cases without height
        $content = $content -replace "width:\s*'390px',", "width: '100%',`r`n          maxWidth: 'var(--container-max-width)',"
        
        Set-Content $file -Value $content -NoNewline
        $count++
        Write-Host "Updated: $file"
    }
}

Write-Host "`nTotal files updated: $count"
