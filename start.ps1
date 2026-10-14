$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiProject = Join-Path $root "..\..\ASP\Shop\Shop.Api\Shop.Api.csproj"

if (-not (Test-Path $apiProject)) {
    Write-Host ("Не знайдено бекенд: " + $apiProject)
    exit 1
}

$apiProject = (Resolve-Path $apiProject).Path

function Stop-Listeners {
    param([int[]]$Ports)

    foreach ($port in $Ports) {
        $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        foreach ($connection in $connections) {
            Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "Зупиняю попередній запуск, якщо він ще працює..."
Stop-Listeners -Ports 7000, 5097, 5173

if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Host "Не знайдено dotnet. Встановіть .NET SDK і запустіть скрипт ще раз."
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Не знайдено npm. Встановіть Node.js і запустіть скрипт ще раз."
    exit 1
}

if (-not (Test-Path (Join-Path $root "node_modules"))) {
    Write-Host "Встановлюю залежності фронтенду..."
    Push-Location $root
    npm install
    if ($LASTEXITCODE -ne 0) {
        Pop-Location
        exit 1
    }
    Pop-Location
}

Write-Host "Запускаю бекенд..."
$backendCommand = 'title Shop API & dotnet run --launch-profile https --project "' + $apiProject + '"'
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", $backendCommand

Write-Host "Чекаю, поки API відповість..."
$apiReady = $false
for ($try = 1; $try -le 60; $try++) {
    $code = (& curl.exe -k -s -o NUL -w "%{http_code}" --max-time 3 "https://127.0.0.1:7000/api/v1/Category" 2>$null)
    $code = "$code".Trim()

    if ($code -eq "200" -or $code -eq "404") {
        $apiReady = $true
        break
    }

    Start-Sleep -Seconds 2
}

if (-not $apiReady) {
    Write-Host "Бекенд не відповів. Подивіться вікно Shop API."
    exit 1
}

Write-Host "Запускаю фронтенд..."
$frontendCommand = 'title Aura shop & cd /d "' + $root + '" && npx vite --host 127.0.0.1 --port 5173'
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", $frontendCommand

$frontendReady = $false
for ($try = 1; $try -le 30; $try++) {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $client.Connect("127.0.0.1", 5173)
        $frontendReady = $true
        break
    }
    catch {
        Start-Sleep -Seconds 1
    }
    finally {
        $client.Dispose()
    }
}

if (-not $frontendReady) {
    Write-Host "Фронтенд не відповів. Подивіться вікно Aura shop."
    exit 1
}

Start-Process "http://127.0.0.1:5173/"
Write-Host ""
Write-Host "Готово. Магазин: http://127.0.0.1:5173/"
Write-Host "Не закривайте вікна Shop API та Aura shop, поки показуєте роботу."
