$ErrorActionPreference = "Stop"

Write-Host "Merging localization files..." -ForegroundColor Cyan

$translationsPath = "child_story_mobile\assets\translations"

# Read the JSON files
$enMain = Get-Content "$translationsPath\en.json" -Raw | ConvertFrom-Json
$trMain = Get-Content "$translationsPath\tr.json" -Raw | ConvertFrom-Json
$enSettings = Get-Content "$translationsPath\settings_en.json" -Raw | ConvertFrom-Json
$trSettings = Get-Content "$translationsPath\settings_tr.json" -Raw | ConvertFrom-Json

Write-Host "Adding settings keys to English translations..." -ForegroundColor Yellow

# Add each settings key to main files
foreach ($key in $enSettings.PSObject.Properties.Name) {
    $enMain | Add-Member -MemberType NoteProperty -Name $key -Value $enSettings.$key -Force
}

foreach ($key in $trSettings.PSObject.Properties.Name) {
    $trMain | Add-Member -MemberType NoteProperty -Name $key -Value $trSettings.$key -Force
}

Write-Host "Writing merged files..." -ForegroundColor Yellow

# Convert back to JSON with proper formatting
$enJson = $enMain | ConvertTo-Json -Depth 10
$trJson = $trMain | ConvertTo-Json -Depth 10

# Write to files
$enJson | Out-File "$translationsPath\en.json" -Encoding UTF8 -NoNewline
$trJson | Out-File "$translationsPath\tr.json" -Encoding UTF8 -NoNewline

Write-Host "Localization files merged successfully!" -ForegroundColor Green
