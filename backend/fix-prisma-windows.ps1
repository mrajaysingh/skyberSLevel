# Fix Prisma Client Generation on Windows
# This script handles EPERM errors by stopping processes and regenerating

Write-Host "Fixing Prisma Client generation..." -ForegroundColor Yellow

# Stop any running Node processes
Write-Host "Stopping Node.js processes..." -ForegroundColor Cyan
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait for file locks to release
Write-Host "Waiting for file locks to release..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# Delete .prisma directory if it exists
$prismaPath = "node_modules\.prisma"
if (Test-Path $prismaPath) {
    Write-Host "Removing old Prisma Client..." -ForegroundColor Cyan
    Remove-Item -Path $prismaPath -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Green
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Prisma Client generated successfully!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Prisma Client generation failed. Try running as Administrator." -ForegroundColor Red
    Write-Host "Or manually: rmdir /s /q node_modules\.prisma && npx prisma generate" -ForegroundColor Yellow
}

