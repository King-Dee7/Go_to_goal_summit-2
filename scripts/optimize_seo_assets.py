import os
from PIL import Image

def main():
    workspace_dir = r"c:\Users\kingd\From Go To Goal Summit"
    icon_path = os.path.join(workspace_dir, "app", "icon.jpg")
    og_path = os.path.join(workspace_dir, "public", "Og image.png")
    
    print("Optimizing Favicon...")
    if os.path.exists(icon_path):
        icon_img = Image.open(icon_path)
        # Save 192x192 PNG favicon
        icon_png = icon_img.resize((192, 192), Image.Resampling.LANCZOS)
        out_png_path = os.path.join(workspace_dir, "app", "icon.png")
        icon_png.save(out_png_path, "PNG", optimize=True)
        print(f"Created optimized icon.png at {out_png_path} ({os.path.getsize(out_png_path) / 1024:.1f} KB)")
        
        # Save 32x32 ICO favicon
        out_ico_path = os.path.join(workspace_dir, "public", "favicon.ico")
        icon_ico = icon_img.resize((32, 32), Image.Resampling.LANCZOS)
        icon_ico.save(out_ico_path, format="ICO")
        print(f"Created legacy favicon.ico at {out_ico_path} ({os.path.getsize(out_ico_path) / 1024:.1f} KB)")
    else:
        print(f"Error: icon.jpg not found at {icon_path}")

    print("\nOptimizing Open Graph Image...")
    if os.path.exists(og_path):
        og_img = Image.open(og_path)
        # Resize to standard 1200x630
        og_resized = og_img.resize((1200, 630), Image.Resampling.LANCZOS)
        out_og_path = os.path.join(workspace_dir, "public", "og-image.png")
        og_resized.save(out_og_path, "PNG", optimize=True)
        print(f"Created optimized og-image.png at {out_og_path} ({os.path.getsize(out_og_path) / 1024:.1f} KB)")
    else:
        print(f"Error: Og image.png not found at {og_path}")

if __name__ == "__main__":
    main()
