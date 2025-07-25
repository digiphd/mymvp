#!/bin/bash

echo "🧪 Testing MyMVP API locally"
echo ""

# Set up environment variables for testing
export API_SECRET_KEY="test-key-12345"
export LOOPS_API_KEY="dummy-key"  
export SUPABASE_URL="https://dummy.supabase.co"
export SUPABASE_ANON_KEY="dummy-key"
export CORS_ORIGIN="http://localhost:3000"
export ADMIN_EMAIL="test@example.com"
export NODE_ENV="development"
export PORT="8080"

echo "1. Starting API server..."
echo "   Run: cd apps/api && npm run dev"
echo ""

echo "2. Test health endpoint:"
echo "   curl http://localhost:8080/health"
echo ""

echo "3. Test application submission:"
echo '   curl -X POST http://localhost:8080/api/applications \\'
echo '     -H "Content-Type: application/json" \\'
echo '     -H "x-api-key: test-key-12345" \\'
echo '     -d '{
echo '       "name": "Test User",'
echo '       "email": "test@example.com",'
echo '       "productName": "Test SaaS Product",'
echo '       "prdOutput": "This is a test PRD content that is longer than 500 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",'
echo '       "projectType": "full-mvp",'
echo '       "budget": "$5-10K, need it within 2 weeks",'
echo '       "readiness": "understanding,feedback",'
echo '       "technicalPrefs": "React and Node.js preferred",'
echo '       "first10Users": "Social media marketing and influencer outreach",'
echo '       "first100Users": "Content marketing and partnerships",'
echo '       "marketingChannels": "social-media,content-marketing",'
echo '       "marketingExperience": "experienced"'
echo '     }'
echo ""

echo "4. Expected responses:"
echo "   - Health check: {\"status\":\"ok\",\"timestamp\":\"...\",\"version\":\"1.0.0\"}"
echo "   - Application: {\"status\":\"success\",\"qualification\":\"highly_qualified\",...}"
echo ""

echo "5. Common issues:"
echo "   - Missing .env file: Copy .env.example to .env and fill values"
echo "   - Port 3001 in use: Change PORT in .env file"
echo "   - Missing API key: Include x-api-key header with requests"