$srcDir = "C:\Users\Keem\.gemini\antigravity\brain\3f255250-aae7-459e-82db-b987663452a8"
$publicDir = "C:\Users\Keem\Desktop\docbuilder\public"
$workspaceDir = "C:\Users\Keem\Desktop\docbuilder"

$files = @(
    "phase_f_chonburi_kanit_document.pdf",
    "phase_f_chonburi_kanit_presentation.pptx",
    "phase_f_slide1_render.png",
    "phase_f_slide2_render.png",
    "phase_f_document_render.png",
    "phase_f_font_picker_modal.png",
    "phase_f_editor_selected.png"
)

foreach ($f in $files) {
    $src = Join-Path $srcDir $f
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination (Join-Path $publicDir $f) -Force
        Copy-Item -Path $src -Destination (Join-Path $workspaceDir $f) -Force
        Write-Host "Copied $f successfully"
    } else {
        Write-Warning "Missing $src"
    }
}
