
$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open('C:\\Users\\Keem\\Desktop\\docbuilder\\scratch\\test_font_matrix.pptx', [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $outPng = "C:\\Users\\Keem\\Desktop\\docbuilder\\scratch\\matrix_slide_$i.png"
    $pres.Slides.Item($i).Export($outPng, 'PNG', 1280, 720)
    Write-Host "Exported Slide $i to $outPng"
}
$pres.Close()
$ppt.Quit()
