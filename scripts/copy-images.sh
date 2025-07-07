#!/bin/bash

# Create necessary directories
mkdir -p public/images/social

# Copy images
cp ../images/webdev.svg public/images/
cp ../images/apps.jpeg public/images/
cp ../images/coffee.jpeg public/images/
cp ../images/svg.jpeg public/images/
cp ../images/aws.jpeg public/images/
cp ../images/contact.jpg public/images/
cp ../images/social/linkedin.jpg public/images/social/
cp ../images/GitHub.png public/images/
cp ../images/location.jpg public/images/

# Copy favicon and other icons
cp ../favicon-16x16.png public/
cp ../favicon-32x32.png public/
cp ../apple-touch-icon.png public/
cp ../manifest.json public/
cp ../safari-pinned-tab.svg public/

echo "Images copied successfully!"