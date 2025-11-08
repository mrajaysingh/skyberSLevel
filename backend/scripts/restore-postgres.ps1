Param(
    [Parameter(Mandatory = $false)] [string] $SourceConnectionString,
    [Parameter(Mandatory = $true)] [string] $TargetConnectionString,
    [Parameter(Mandatory = $false)] [string] $DumpFile,
    [string] $PgDumpPath = "pg_dump",
    [string] $PgRestorePath = "pg_restore",
    [string] $PsqlPath = "psql"
)

Write-Host "Preparing to restore to target database..." -ForegroundColor Cyan

try {
    if (-not $DumpFile -and -not $SourceConnectionString) {
        throw "Provide either -DumpFile or -SourceConnectionString"
    }

    if ($DumpFile) {
        if (-not (Test-Path -Path $DumpFile)) {
            throw "Dump file not found: $DumpFile"
        }
        Write-Host "Restoring from dump file: $DumpFile" -ForegroundColor Yellow
        & $PgRestorePath --clean --if-exists --no-owner --no-privileges --dbname "$TargetConnectionString" "$DumpFile"
        $exitCode = $LASTEXITCODE
        if ($exitCode -ne 0) { throw "pg_restore failed with exit code $exitCode" }
        Write-Host "Restore completed successfully." -ForegroundColor Green
        exit 0
    }

    # Streaming mode: dump schema+data from source and pipe to target via psql (plain SQL)
    Write-Host "Streaming from source to target (plain SQL)..." -ForegroundColor Yellow
    $dumpArgs = @(
        "--format=plain",
        "--no-owner",
        "--no-privileges",
        "--encoding=UTF8",
        "--dbname=$SourceConnectionString"
    )
    $psqlArgs = @(
        "--dbname=$TargetConnectionString"
    )

    $dumpProc = Start-Process -FilePath $PgDumpPath -ArgumentList $dumpArgs -NoNewWindow -PassThru -RedirectStandardOutput "-"
    $psqlProc = Start-Process -FilePath $PsqlPath -ArgumentList $psqlArgs -NoNewWindow -PassThru -RedirectStandardInput $dumpProc.StandardOutput

    $dumpProc.WaitForExit()
    $psqlProc.WaitForExit()

    if ($dumpProc.ExitCode -ne 0) { throw "pg_dump failed with exit code $($dumpProc.ExitCode)" }
    if ($psqlProc.ExitCode -ne 0) { throw "psql failed with exit code $($psqlProc.ExitCode)" }

    Write-Host "Streaming migration completed successfully." -ForegroundColor Green
    exit 0
}
catch {
    Write-Error $_
    exit 1
}


