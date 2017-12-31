
param([bool]$install = $false, [bool]$build = $false, [string]$bar = "bar")

$projs = @("common", "hosted-functions", "app", "extension")

ForEach ($proj in $projs) {
	"$proj = " + $proj.length
	Push-Location $proj
	if ($install) {
		npm install 
	}
	if ($build) {
		npm run build
	}
	Pop-Location
}
