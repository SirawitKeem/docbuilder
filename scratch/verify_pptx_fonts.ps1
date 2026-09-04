$pptxPath = 'C:\Users\Keem\.gemini\antigravity\brain\3f255250-aae7-459e-82db-b987663452a8\phase_f_chonburi_kanit_presentation.pptx'
$outSlide1 = 'C:\Users\Keem\.gemini\antigravity\brain\3f255250-aae7-459e-82db-b987663452a8\phase_f_slide1_render.png'
$outSlide2 = 'C:\Users\Keem\.gemini\antigravity\brain\3f255250-aae7-459e-82db-b987663452a8\phase_f_slide2_render.png'

try {
    $ppt = New-Object -ComObject PowerPoint.Application
    $pres = $ppt.Presentations.Open($pptxPath, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    
    Write-Host "Total slides in presentation: $($pres.Slides.Count)"
    
    $slide1 = $pres.Slides.Item(1)
    Write-Host "Slide 1 Shapes Count: $($slide1.Shapes.Count)"
    foreach ($shape in $slide1.Shapes) {
        if ($shape.HasTextFrame -eq -1) {
            $tf = $shape.TextFrame
            if ($tf.HasText -eq -1) {
                $txt = $tf.TextRange.Text.Trim()
                $len = [Math]::Min(35, $txt.Length)
                $snippet = $txt.Substring(0, $len)
                $font = $tf.TextRange.Font.Name
                Write-Host "  [Shape]: $snippet ... -> Font: $font"
            }
        }
    }

    $slide1.Export($outSlide1, 'PNG', 1280, 720)
    Write-Host "Exported Slide 1 PNG: $(Test-Path $outSlide1)"

    $slide2 = $pres.Slides.Item(2)
    foreach ($shape in $slide2.Shapes) {
        if ($shape.HasTextFrame -eq -1) {
            $tf = $shape.TextFrame
            if ($tf.HasText -eq -1) {
                $txt = $tf.TextRange.Text.Trim()
                $len = [Math]::Min(35, $txt.Length)
                $snippet = $txt.Substring(0, $len)
                $font = $tf.TextRange.Font.Name
                Write-Host "  [Shape Slide 2]: $snippet ... -> Font: $font"
            }
        }
    }

    $slide2.Export($outSlide2, 'PNG', 1280, 720)
    Write-Host "Exported Slide 2 PNG: $(Test-Path $outSlide2)"

    $pres.Close()
    $ppt.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
    Write-Host "SUCCESS: PowerPoint COM verified and exported cleanly!"
} catch {
    Write-Error "COM Error: $_"
    exit 1
}
