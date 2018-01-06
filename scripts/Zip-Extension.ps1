$manifest = Get-Content .\extension\dist\manifest.json | Out-String | ConvertFrom-Json
$manifest.version
$v = $manifest.version
Compress-Archive -DestinationPath .\extension\busy-bishop.$v.zip -Path .\extension\dist\*
