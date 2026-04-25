#!/bin/bash

# --- Help Message ---
show_help() {
    echo "Usage: ./super_optimize.sh [directory] [max_width]"
    echo "Description:"
    echo "  1. Resizes images to a max width (default 1920px)."
    echo "  2. Strips metadata (EXIF) to reduce size."
    echo "  3. Creates a .webp version of every JPG/PNG."
    echo "  4. Performs lossless compression on original JPG/PNGs."
    exit 0
}

if [[ "$1" == "-h" || "$1" == "--help" ]]; then show_help; fi

TARGET_DIR=${1:-"."}
MAX_WIDTH=${2:-1920}

echo "🚀 Starting Full Suite Optimization in: $TARGET_DIR"

# Find all JPG, JPEG, and PNG files
find "$TARGET_DIR" -type f \( -iname "*.webp" -o -iname "*.jpeg" -o -iname "*.webp" \) -print0 | while IFS= read -r -d '' file; do
    echo "Processing: $file"
    
    # 1. Resize & Strip (ImageMagick)
    # Shrinks only if larger than MAX_WIDTH, removes profiles/comments.
    mogrify -resize "${MAX_WIDTH}>" -strip "$file"
    
    # 2. Generate WebP version (cwebp)
    # -q 80 provides a great balance of quality vs size.
    webp_file="${file%.*}.webp"
    cwebp -q 80 "$file" -o "$webp_file" -quiet
    
    # 3. Lossless Compression for Originals (Fallback support)
    extension="${file##*.}"
    case "${extension,,}" in
        jpg|jpeg)
            jpegoptim --strip-all -p "$file" > /dev/null 2>&1
        ;;
        png)
            optipng -o2 -strip all "$file" > /dev/null 2>&1
        ;;
    esac
done

echo "✅ Optimization and WebP conversion complete!"
