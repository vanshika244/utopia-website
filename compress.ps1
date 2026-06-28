Add-Type -AssemblyName System.Drawing

function Compress-Image {
    param (
        [string]$Path,
        [int]$Quality = 60
    )
    try {
        $img = [System.Drawing.Image]::FromFile($Path)
        
        # Find the JPEG encoder
        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
        if (-not $encoder) {
            $img.Dispose()
            return
        }
        
        # Set quality parameter
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        
        # Save to temp file
        $tempPath = $Path + ".tmp"
        $img.Save($tempPath, $encoder, $encoderParams)
        $img.Dispose()
        
        # Replace original file
        Move-Item -Path $tempPath -Destination $Path -Force
        Write-Host "  -> Success!"
    } catch {
        Write-Host "  -> Error: $_"
    }
}

# Find all JPG and JPEG files in the assets/img folder larger than 1MB
$files = Get-ChildItem -Path "utopia website\assets\img" -Recurse | Where-Object { 
    $_.Extension -match '^\.(jpg|jpeg|JPG)$' -and $_.Length -gt 1MB 
}

Write-Host "Found $($files.Count) JPEG files larger than 1MB. Starting compression..."

foreach ($file in $files) {
    $origSize = [math]::round($file.Length / 1MB, 2)
    Write-Host "Compressing $($file.Name) (Original: $origSize MB)..."
    Compress-Image -Path $file.FullName
}

Write-Host "Compression complete!"
