$htmlPath = "C:\Users\dylan\Documents\Proyecto_web_encuesta\Encuesta_Satisfaccion_PAE.html"
$content = [System.IO.File]::ReadAllText($htmlPath)

# Regex to find CSS
$cssPattern = '(?s)<style>(.*?)</style>'
if ($content -match $cssPattern) {
    $cssContent = $matches[1].Trim()
    [System.IO.File]::WriteAllText("C:\Users\dylan\Documents\Proyecto_web_encuesta\css\styles.css", $cssContent)
}

# Regex to find JS
$jsPattern = '(?s)<script>(.*?)</script>'
if ($content -match $jsPattern) {
    $jsContent = $matches[1].Trim()
    [System.IO.File]::WriteAllText("C:\Users\dylan\Documents\Proyecto_web_encuesta\js\app.js", $jsContent)
}

# Replace in HTML
$newContent = $content -replace '(?s)<style>.*?</style>', '<link rel="stylesheet" href="css/styles.css">'
$newContent = $newContent -replace '(?s)<script>.*?</script>', '<script src="js/app.js"></script>'
$newContent = $newContent -replace '<img src="https://www.master2000.net/recursos/uploads/324/2018/LOGO1.jpg"[^>]*>', '<img src="assets/logo.png" alt="Logo IE MJM">'

# Write new HTML
[System.IO.File]::WriteAllText("C:\Users\dylan\Documents\Proyecto_web_encuesta\index.html", $newContent)

# Delete old HTML
Remove-Item $htmlPath -Force
