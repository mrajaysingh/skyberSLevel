param(
    [string]$OutputDirectory = "../backups",
    [string]$FilePrefix = "skyber_backup"
)

$ErrorActionPreference = "Stop"

function Get-DatabaseUrl {
    $envPath = Join-Path -Path (Split-Path -Parent $PSScriptRoot) -ChildPath ".env"
    if (-not (Test-Path $envPath)) {
        throw "Cannot find .env file at $envPath"
    }

    $databaseLine = Get-Content $envPath | Where-Object { $_ -match '^\s*DATABASE_URL\s*=' } | Select-Object -First 1
    if (-not $databaseLine) {
        throw "DATABASE_URL not found in .env"
    }

    $value = $databaseLine -replace '^\s*DATABASE_URL\s*=\s*', ''
    $value = $value.Trim()
    if ($value.StartsWith('"') -and $value.EndsWith('"')) {
        $value = $value.Substring(1, $value.Length - 2)
    }
    if (-not $value) {
        throw "DATABASE_URL value is empty"
    }
    return $value
}

function Parse-PostgresUrl([string]$url) {
    $regex = [regex]'^(?<scheme>postgres(?:ql)?)://(?<user>[^:]+):(?<password>[^@]+)@(?<host>[^:/?#]+)(?::(?<port>\d+))?/(?<database>[^?#]+)'
    $match = $regex.Match($url)
    if (-not $match.Success) {
        throw "DATABASE_URL is not a recognized PostgreSQL connection string"
    }
    return [pscustomobject]@{
        User     = $match.Groups['user'].Value
        Password = $match.Groups['password'].Value
        Host     = $match.Groups['host'].Value
        Port     = if ($match.Groups['port'].Success) { [int]$match.Groups['port'].Value } else { 5432 }
        Database = $match.Groups['database'].Value
    }
}

function Ensure-PgDump {
    $pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
    if (-not $pgDump) {
        throw "pg_dump not found. Install PostgreSQL client tools and ensure pg_dump is on PATH."
    }
    return $pgDump.Path
}

try {
    $pgDumpPath = Ensure-PgDump
    $databaseUrl = Get-DatabaseUrl
    $connection = Parse-PostgresUrl -url $databaseUrl

    $resolvedOutput = Resolve-Path -Path (Join-Path -Path $PSScriptRoot -ChildPath $OutputDirectory) -ErrorAction SilentlyContinue
    if (-not $resolvedOutput) {
        $resolvedOutput = New-Item -Path (Join-Path -Path $PSScriptRoot -ChildPath $OutputDirectory) -ItemType Directory -Force
    }

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $fileName = "{0}_{1}.dump" -f $FilePrefix, $timestamp
    $outputFile = Join-Path -Path $resolvedOutput -ChildPath $fileName

    Write-Host "Backing up database '$($connection.Database)' to $outputFile" -ForegroundColor Cyan

    $env:PGPASSWORD = $connection.Password

    & $pgDumpPath `
        --host $connection.Host `
        --port $connection.Port `
        --username $connection.User `
        --format=custom `
        --file $outputFile `
        $connection.Database

    Write-Host "Backup completed: $outputFile" -ForegroundColor Green
}
catch {
    Write-Error $_
    exit 1
}
finally {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue | Out-Null
}

