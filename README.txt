
 Weather Analytics

A weather analytics application that fetches real-time weather data for Sri Lankan cities, calculates a custom Comfort Index, and displays ranked results on a responsive dashboard.


 Tech Stack

Backend: Laravel 11 (PHP 8.2)
Frontend: React 18 + TypeScript + Vite
Database: PostgreSQL (Supabase)
Styling: Tailwind CSS
Authentication: Auth0 (with MFA)
Charts: Recharts


Setup Guide

Prerequisites

PHP 8.2+ (with pdo_pgsql extension)
Composer
Node.js 18+
npm
OpenWeatherMap API key
Auth0 account
Supabase project



Backend Setup

cd backend
composer install
cp .env.example .env
php artisan key:generate




Run the application:


php artisan migrate
php artisan serve


Backend runs at:


http://localhost:8000



Frontend Setup

cd frontend
npm install
cp .env.example .env


Set Auth0 credentials inside the .env file.

Start the development server:


npm run dev


Frontend runs at:


http://localhost:5173




Auth0 Configuration

1. Create a Single Page Application.
2. Set Allowed Callback, Logout, and Web Origins to:

   http://localhost:5173
   
3. Create an API with identifier:

 http://localhost:8000/api

4. Disable public signups (Authentication → Database → Settings).
5. Enable MFA via email (Security → Multi-factor Auth).
6. Test credentials:

   careers@fidenz.com
   Pass#fidenz


---

Comfort Index Formula

The Comfort Index score ranges from 0 to 100.


Score = (T × 0.40) + (H × 0.30) + (W × 0.20) + (V × 0.10)


Each sub-score is normalized between 0 and 1 before weighting.

Parameters and Weights

| Parameter   | Weight | Method                                          |
| ----------- | ------ | ----------------------------------------------- |
| Temperature | 40%    | Gaussian centered at 22°C (sigma = 10)          |
| Humidity    | 30%    | Gaussian centered at 50% (sigma = 30)           |
| Wind Speed  | 20%    | Full score up to 5 m/s, exponential decay after |
| Visibility  | 10%    | Linear scale capped at 10 km                    |



Design Rationale

Temperature has the highest weight because it has the strongest impact on perceived comfort.
Gaussian functions are used for temperature and humidity to model comfort drop-offs in both directions from ideal values.
Wind speed provides full comfort up to moderate levels, with decay for stronger winds.
Visibility is included as a minor environmental comfort indicator.



Caching Strategy

Raw API responses cached per city for 5 minutes
  Key format: weather_raw_{cityCode}
Processed results cached for 5 minutes
  Key format: weather_processed_all

Cache is stored in PostgreSQL (Supabase).

Debug endpoint:


GET /api/cache-status


This dual-layer caching:

Protects the OpenWeatherMap API rate limit
Avoids repeated score computation and sorting



API Endpoints

| Method | Endpoint                | Auth Required | Description                         |
| ------ | ----------------------- | ------------- | ----------------------------------- |
| GET    | /api/weather            | Yes           | All cities with scores and rankings |
| GET    | /api/weather/{cityCode} | Yes           | Single city details                 |
| GET    | /api/cache-status       | No            | Cache HIT/MISS debug information    |



Running Tests

cd backend
php artisan test


Unit tests cover:

Perfect comfort conditions
Extreme heat and cold
Boundary values
Missing data handling


Known Limitations

OpenWeatherMap free tier limit: 60 calls per minute
UV index and precipitation are not included in the calculation
Weather icons require internet access
Auth0 free tier limits: 7,000 active users and 1,000 M2M tokens per month



