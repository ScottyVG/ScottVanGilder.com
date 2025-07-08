# Blog Images Guide

## 📸 How to Add Images to Your Blog Posts

### **🎯 Quick Reference:**
```markdown
![Alt text description](/images/blog/your-image.jpg)
```

### **📁 Image Organization:**
```
public/
└── images/
    └── blog/
        ├── snowboarding.jpeg          # Already exists
        ├── your-post-name/            # Organize by post (optional)
        │   ├── hero-image.jpg
        │   ├── diagram.png
        │   └── screenshot.jpg
        └── shared/                    # Reusable images
            ├── aws-logo.png
            └── profile-pic.jpg
```

## 🖼️ Image Best Practices

### **1. File Formats**
- **JPEG (.jpg/.jpeg)**: Photos, complex images
- **PNG (.png)**: Screenshots, diagrams, images with transparency
- **WebP (.webp)**: Modern format, smaller file sizes (recommended)
- **SVG (.svg)**: Icons, simple graphics

### **2. File Naming**
- Use **lowercase** and **hyphens**: `my-awesome-photo.jpg`
- Be **descriptive**: `terraform-architecture-diagram.png`
- Avoid **spaces** and **special characters**

### **3. Image Sizes**
- **Hero images**: 1200x630px (good for social sharing)
- **Content images**: 800px wide max
- **Screenshots**: Original size, but optimize file size
- **Keep file sizes under 500KB** when possible

### **4. Alt Text**
Always include descriptive alt text for accessibility:
```markdown
![Scott snowboarding down a mountain slope in Colorado](/images/blog/snowboarding.jpeg)
```

## 📝 Markdown Image Syntax

### **Basic Image**
```markdown
![Alt text](/images/blog/my-image.jpg)
```

### **Image with Title (tooltip)**
```markdown
![Alt text](/images/blog/my-image.jpg "Hover tooltip text")
```

### **Linked Image**
```markdown
[![Alt text](/images/blog/my-image.jpg)](/images/blog/my-image-full-size.jpg)
```

### **Multiple Images**
```markdown
![First image](/images/blog/image1.jpg)

![Second image](/images/blog/image2.jpg)

Some text between images...

![Third image](/images/blog/image3.jpg)
```

## 🎨 Image Styling

Images in your blog posts automatically get these styles:
- **Rounded corners** for a modern look
- **Shadow** for depth
- **Centered** in the content
- **Responsive** sizing for mobile devices
- **Proper spacing** above and below

## 📱 Responsive Images

Your images will automatically be responsive, but for best results:
- Use images at least **800px wide**
- The system will scale them down on mobile
- Consider the **aspect ratio** for different screen sizes

## 🚀 Adding Images Workflow

### **Method 1: Direct Upload**
1. Add your image to `public/images/blog/`
2. Use the correct path in your markdown: `/images/blog/filename.jpg`
3. Test with `npm run dev`

### **Method 2: Organized by Post**
1. Create a folder: `public/images/blog/my-post-name/`
2. Add images to that folder
3. Reference: `/images/blog/my-post-name/image.jpg`

## 🔧 Image Optimization Tips

### **Before Adding Images:**
1. **Resize** to appropriate dimensions
2. **Compress** to reduce file size
3. **Convert** to modern formats (WebP) if possible
4. **Test** on different devices

### **Tools for Optimization:**
- **Online**: TinyPNG, Squoosh.app
- **Mac**: ImageOptim, Photoshop
- **Command line**: `imagemagick`, `cwebp`

## 📋 Example Blog Post with Images

```markdown
---
title: "My Colorado Adventure"
excerpt: "A day of snowboarding in the Rocky Mountains"
date: "2024-01-15"
readTime: "5 min read"
tags: ["Colorado", "Snowboarding", "Adventure"]
author: "Scott Van Gilder"
---

# My Colorado Adventure

Colorado offers some of the best snowboarding in the world. Here's my recent adventure on the slopes.

![Beautiful mountain vista in Colorado](/images/blog/colorado-mountains.jpg)

## The Perfect Day

The conditions were perfect - fresh powder and clear skies.

![Scott snowboarding down the mountain](/images/blog/scott-snowboarding.jpg "Scott enjoying the fresh powder")

## Equipment Setup

Here's the gear I used for this adventure:

![Snowboard and boots setup](/images/blog/snowboard-gear.jpg)

The day was absolutely incredible, and I can't wait to get back out there!
```

## ⚠️ Common Issues & Solutions

### **Image Not Showing?**
- ✅ Check the path starts with `/images/blog/`
- ✅ Verify the file exists in `public/images/blog/`
- ✅ Check filename spelling and case sensitivity
- ✅ Make sure file extension is correct

### **Image Too Large?**
- ✅ Resize the image before uploading
- ✅ Use image compression tools
- ✅ Consider using WebP format

### **Image Not Responsive?**
- ✅ Don't specify width/height in markdown
- ✅ Let the CSS handle responsive sizing
- ✅ Use images at least 800px wide

## 🎯 Quick Checklist

Before publishing a blog post with images:
- [ ] Images are in `public/images/blog/`
- [ ] Paths start with `/images/blog/`
- [ ] Alt text is descriptive and helpful
- [ ] File sizes are optimized (< 500KB)
- [ ] Images look good on mobile and desktop
- [ ] Test with `npm run dev`

## 📚 Advanced Tips

### **Image Captions**
While markdown doesn't have native caption support, you can add them:
```markdown
![Alt text](/images/blog/image.jpg)
*Caption text goes here*
```

### **Image Galleries**
For multiple related images:
```markdown
![Image 1](/images/blog/gallery-1.jpg)
![Image 2](/images/blog/gallery-2.jpg)
![Image 3](/images/blog/gallery-3.jpg)
```

### **Hero Images**
For a large header image at the top of your post:
```markdown
![Post hero image](/images/blog/hero-image.jpg)

# Your Post Title

Your content starts here...
```

## 🔗 Links in Blog Posts

### **Link Styling**
Links in your blog posts are automatically styled with:
- **Blue color** (`#2563eb`) in light mode
- **Light blue** (`#60a5fa`) in dark mode
- **Medium font weight** for better visibility
- **Smooth hover transitions** with underlines
- **No underlines by default** for cleaner appearance

### **Link Syntax**
```markdown
[Link text](https://example.com)
[Internal link](https://scottvangilder.com/#contact)
[Email link](mailto:scott@example.com)
```

### **Link Best Practices**
- Use **descriptive link text** (not "click here")
- **Test external links** to ensure they work
- Consider **opening external links** in new tabs (handled automatically)
- Use **relative paths** for internal site links when possible

---

Your blog now supports beautiful, responsive images and well-styled links that enhance your storytelling and engage your readers!