$accidents = Get-Content .\last.json | ConvertFrom-Json

$res = @{}
foreach ($item in $accidents.PSObject.Properties.GetEnumerator())
{
  $res[$item.Name] = @{
    "AC_blessures_pilote" = $item.Value.AC_blessures_pilote
    "AC_date_heure" = $item.Value.AC_date_heure
    "AC_parapente_classe" = $item.Value.AC_parapente_classe
    "latitude" = $item.Value.latitude
    "longitude" = $item.Value.longitude
  }
}

"var accidents=" | Out-File accidents_minimal.js
$res | ConvertTo-Json >>accidents_minimal.js
