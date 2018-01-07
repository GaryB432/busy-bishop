
Copy-Item .\secret\ -Destination .\_for-import\ -Force -Recurse
Copy-Item .\common\src\models.ts .\_for-import\models.ts

Remove-Item .\common\src\imported -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item .\_for-import -Destination .\common\src\imported -Recurse

# Remove-Item .\app\src\imported -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item .\_for-import\environments -Destination .\app\src\environments -Recurse 

Remove-Item .\extension\src\imported -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item .\_for-import -Destination .\extension\src\imported -Recurse 

Remove-Item .\hosted-functions\write-suggestion\imported -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory .\hosted-functions\write-suggestion\imported -ErrorAction SilentlyContinue | Out-Null
Copy-Item .\_for-import\models.ts -Destination .\hosted-functions\write-suggestion\imported\models.ts 

Remove-Item .\_for-import -Recurse -ErrorAction SilentlyContinue

Push-Location common
# npm run build
Pop-Location

Copy-Item .\common\lib -Destination .\hosted-functions\get-suggestions\imported\common -Force -Recurse
Copy-Item .\common\lib -Destination .\app\src\imported\common -Force -Recurse
