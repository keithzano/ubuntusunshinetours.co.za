# Google Reviews Integration Setup

## Overview
The Ubuntu Sunshine Tours website now integrates with Google My Business to display real customer reviews and provide easy ways for customers to leave reviews.

## Features

### 1. Dynamic Google Reviews Display
- Fetches real reviews from your Google My Business page
- Displays rating, review count, and individual reviews
- Caches reviews for 1 hour to improve performance
- Falls back to sample reviews if API is unavailable

### 2. Client Review System
- Clients can leave reviews after completing tours
- Reviews are linked to actual bookings (verified reviews)
- Admin approval workflow for quality control
- Photo uploads with reviews
- 5-star rating system with titles and comments

### 3. Admin Review Management
- Admin dashboard to approve/reject reviews
- Filter by status and rating
- Delete inappropriate reviews
- View full review details

## Setup Instructions

### 1. Google Places API Key

To fetch real Google Reviews, you need a Google Places API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Places API** 
4. Create credentials (API Key)
5. Add the API key to your `.env` file:

```env
GOOGLE_PLACES_API_KEY=your_api_key_here
```

### 2. Configure Google Place ID

The system is configured for Ubuntu Sunshine Tours:
- Place ID: `CTMi-h2OUqLSEAE`
- Review URL: `https://g.page/r/CTMi-h2OUqLSEAE/review`

If you need to change this, update the `placeId` in:
- `app/Services/GoogleReviewsService.php`

### 3. API Endpoints

The system provides these API endpoints:

- `GET /api/google-reviews` - Get reviews with limit parameter
- `GET /api/google-reviews/summary` - Get rating and review count

### 4. Frontend Components

- `GoogleReviews.tsx` - Reusable component for displaying Google Reviews
- Used on tour pages and home page
- Configurable max reviews and show/hide review button

## How It Works

### Google Reviews Flow

1. **API Request**: Component requests reviews from `/api/google-reviews`
2. **Service Layer**: `GoogleReviewsService` fetches from Google Places API
3. **Caching**: Results cached for 1 hour to improve performance
4. **Fallback**: If API fails, shows sample reviews
5. **Display**: Component renders reviews with rating, text, and author info

### Client Reviews Flow

1. **Booking Completion**: After tour completion, client can leave review
2. **Review Creation**: Client submits review via `/my/bookings/{booking}/reviews/create`
3. **Admin Approval**: Review requires admin approval before publishing
4. **Tour Rating Update**: Tour's average rating is recalculated
5. **Public Display**: Approved reviews shown on tour pages

## Testing

### Without Google API Key

The system will work without an API key using fallback data:
- Shows sample reviews
- Still provides "Leave a Google Review" button
- All functionality works except real data fetching

### With Google API Key

1. Add your API key to `.env`
2. Clear cache: `php artisan cache:clear`
3. Visit any page with Google Reviews component
4. Should show real reviews from your Google My Business

## Customization

### Changing Review Display

In `GoogleReviews.tsx`, you can modify:
- `maxReviews` prop - Number of reviews to show
- `showLeaveReviewButton` prop - Show/hide review button
- Styling and layout of review cards

### Admin Review Settings

In `ReviewController.php`, you can modify:
- Auto-approval settings
- Review validation rules
- Email notifications for new reviews

## Troubleshooting

### Google Reviews Not Showing

1. Check if API key is set in `.env`
2. Verify Places API is enabled in Google Cloud Console
3. Check API key has proper permissions
4. Verify Place ID is correct
5. Check Laravel logs for API errors

### Client Reviews Not Working

1. Verify user has completed bookings
2. Check booking status is 'completed'
3. Verify user is logged in
4. Check ReviewController permissions

### Performance Issues

1. Reviews are cached for 1 hour automatically
2. To clear cache: `php artisan cache:clear`
3. Consider longer cache times for high traffic

## Files Modified/Created

### Backend
- `app/Services/GoogleReviewsService.php` - Google API integration
- `app/Http/Controllers/Api/GoogleReviewsController.php` - API endpoints
- `routes/web.php` - API routes
- `config/google.php` - Google configuration
- `database/seeders/ReviewsSeeder.php` - Sample reviews

### Frontend
- `resources/js/components/GoogleReviews.tsx` - Reviews component
- `resources/js/pages/client/reviews/create.tsx` - Review creation
- `resources/js/pages/reviews/tour-reviews.tsx` - Tour reviews page
- `resources/js/pages/tours/show.tsx` - Added reviews section

## Security Notes

- API key should be kept secure and not exposed in frontend
- Reviews require admin approval to prevent spam
- File uploads are validated and stored securely
- Rate limiting can be added to API endpoints if needed

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live review updates
2. **Review Moderation**: AI-powered content moderation
3. **Review Analytics**: Dashboard for review insights
4. **Multi-language**: Support for reviews in different languages
5. **Social Sharing**: Share reviews on social media
6. **Review Incentives**: Loyalty points for leaving reviews
