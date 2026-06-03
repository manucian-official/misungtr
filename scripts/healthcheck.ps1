$targets = @(
    @{ Name = "web"; Url = "http://127.0.0.1" },
    @{ Name = "api"; Url = "http://127.0.0.1/health" },
    @{ Name = "searxng"; Url = "http://127.0.0.1:8080" },
    @{ Name = "ollama"; Url = "http://127.0.0.1:11434/api/tags" }
)

foreach ($target in $targets) {
    try {
        $response = Invoke-WebRequest $target.Url -UseBasicParsing -TimeoutSec 10
        Write-Host "$($target.Name): $($response.StatusCode)"
    } catch {
        Write-Host "$($target.Name): failed"
        exit 1
    }
}

