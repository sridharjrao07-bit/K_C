Write-Host "Checking Java and JDK on this machine..." -ForegroundColor Cyan

try {
    Write-Host "\njava -version:" -ForegroundColor Yellow
    & java -version 2>&1 | ForEach-Object { Write-Host $_ }
} catch {
    Write-Host "java not found (command failed)." -ForegroundColor Red
}

try {
    Write-Host "\njavac -version:" -ForegroundColor Yellow
    & javac -version 2>&1 | ForEach-Object { Write-Host $_ }
} catch {
    Write-Host "javac not found (command failed)." -ForegroundColor Red
}

Write-Host "\nwhere.exe java:" -ForegroundColor Yellow
try { & where.exe java | ForEach-Object { Write-Host $_ } } catch { Write-Host "where.exe found no java." -ForegroundColor Red }

Write-Host "\nJAVA_HOME environment variable:" -ForegroundColor Yellow
Write-Host $Env:JAVA_HOME

Write-Host "\nSummary:" -ForegroundColor Cyan
if ((Get-Command java -ErrorAction SilentlyContinue) -and (Get-Command javac -ErrorAction SilentlyContinue)) {
    Write-Host "Java and javac are available on PATH." -ForegroundColor Green
} elseif ((Get-Command java -ErrorAction SilentlyContinue) -or (Get-Command javac -ErrorAction SilentlyContinue)) {
    Write-Host "Partial Java tools found; check PATH and JAVA_HOME." -ForegroundColor Yellow
} else {
    Write-Host "Java/JDK not detected. Install a JDK and set JAVA_HOME." -ForegroundColor Red
}
