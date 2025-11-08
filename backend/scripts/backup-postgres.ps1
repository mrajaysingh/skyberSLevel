Param(
    [Parameter(Mandatory = $true)] [string] $ConnectionString,
    [Parameter(Mandatory = $true)] [string] $OutputDir,
    [string] $PgDumpPath = "pg_dump"
)

Write-Host "Preparing to backup database..." -ForegroundColor Cyan

try {
    if (-not (Test-Path -Path $OutputDir)) {
        New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
    }

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $fileName = "postgres_backup_$timestamp.dump"
    $outputFile = Join-Path $OutputDir $fileName

    # Try to resolve pg_dump if a full path isn't provided
    if ($PgDumpPath -eq "pg_dump") {
        $pgDumpInPath = (Get-Command pg_dump -ErrorAction SilentlyContinue)
        if ($null -eq $pgDumpInPath) {
            Write-Warning "pg_dump not found in PATH. If PostgreSQL is installed, set -PgDumpPath to its full path (e.g. 'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe')."
        }
    }

    Write-Host "Running pg_dump..." -ForegroundColor Yellow
    & $PgDumpPath --dbname "$ConnectionString" --format=custom --file "$outputFile"
    $exitCode = $LASTEXITCODE

    if ($exitCode -ne 0) {
        throw "pg_dump failed with exit code $exitCode"
    }

    Write-Host "Backup completed: $outputFile" -ForegroundColor Green
    exit 0
}
catch {
    Write-Error $_
    exit 1
}


