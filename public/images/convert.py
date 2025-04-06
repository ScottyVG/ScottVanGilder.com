from PIL import Image
import sys
import os

def convert_png_to_jpg(input_path, output_path):
    # Open the image file
    with Image.open(input_path) as img:
        # Convert the image to RGB (JPEG doesn't support transparency)
        rgb_img = img.convert('RGB')
        # Save the image in JPEG format
        rgb_img.save(output_path, format='JPEG', quality=95)
        print(f"Converted {input_path} to {output_path}")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python convert.py <input_png_file> <output_jpg_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    if not os.path.isfile(input_file):
        print(f"Error: The file {input_file} does not exist.")
        sys.exit(1)

    convert_png_to_jpg(input_file, output_file)
