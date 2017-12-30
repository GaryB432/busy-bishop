
Param([bool]$install = $False, [bool]$build = $False, [string]$bar = "bar")

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
