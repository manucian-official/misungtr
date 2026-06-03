param(
    [string]$OutputDirectory = "backups"
)

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archiveName = "workspace-$timestamp.tar.gz"

docker run --rm `
    -v mygene_workspace_data:/data:ro `
    -v "${PWD}\${OutputDirectory}:/backup" `
    alpine:3.21 `
    tar -czf "/backup/$archiveName" -C /data .

Write-Host "Created $OutputDirectory\$archiveName"

