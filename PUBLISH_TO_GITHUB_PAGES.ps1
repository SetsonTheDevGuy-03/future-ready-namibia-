$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$repo = if ($args.Count -gt 0) { $args[0] } else { "future-ready-namibia" }

foreach ($app in @("git", "gh")) {
    if (-not (Get-Command $app -ErrorAction SilentlyContinue)) {
        Write-Error "Missing $app. Install Git and GitHub CLI first."
        exit 1
    }
}
gh auth status 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { gh auth login }
$owner = (gh api user --jq ".login").Trim()
Write-Host "GitHub account: $owner"

if (-not (Test-Path ".git")) { git init -b main }
git branch -M main 2>$null
$name = (git config user.name)
if (-not $name) { git config user.name $owner }
$email = (git config user.email)
if (-not $email) { git config user.email "$owner@users.noreply.github.com" }
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { git commit -m "Publish FutureReady Namibia complete website" }

gh repo view "$owner/$repo" 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    git remote get-url origin 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) { git remote add origin "https://github.com/$owner/$repo.git" }
    git push -u origin main
} else {
    gh repo create "$owner/$repo" --public --source=. --remote=origin --push
}
Write-Host "Attempting to enable GitHub Pages..."
gh api --method POST "/repos/$owner/$repo/pages" -f 'source[branch]=main' -f 'source[path]=/' 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "If Pages is not active: GitHub repository > Settings > Pages > Deploy from a branch > main > /(root) > Save"
}
Write-Host "Repository: https://github.com/$owner/$repo"
Write-Host "Expected live site: https://$owner.github.io/$repo/"
Write-Host "Verify publication under Settings > Pages."
