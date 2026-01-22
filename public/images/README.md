# Ubuntu Sunshine Tours - Media Assets

This directory contains media assets downloaded from the original Ubuntu Sunshine Tours website (https://ubuntusunshinetours.co.za/).

## Downloaded Assets

### Logo
- **logo.png** - Main company logo (192x192px, cropped from original)

### Hero Images
- **hero.jpg** - Main hero banner image for the home page
- **safari.jpg** - Safari tour image (used as fallback for tour cards)
- **tour-1.jpg** - Additional tour image (used as fallback for category cards)
- **cape-town.jpg** - Cape Town tour image (used as fallback for location cards)

## Usage

These images are automatically used throughout the application:

1. **Logo** - Displayed in the header navigation
2. **Hero Image** - Used as background for the home page hero section
3. **Fallback Images** - Used when specific tour/category/location images are not available

## Integration

The images have been integrated into the following components:
- `resources/js/layouts/public-layout.tsx` - Logo display
- `resources/js/pages/home.tsx` - Hero section and card fallbacks
- `resources/js/pages/tours/index.tsx` - Tour listing cards
- `resources/js/pages/tours/show.tsx` - Tour detail page and related tours
- `resources/js/pages/cart/index.tsx` - Shopping cart items
- `resources/js/pages/checkout/index.tsx` - Checkout order summary

## Source

All assets were downloaded from the official Ubuntu Sunshine Tours website and are used for development purposes only.
