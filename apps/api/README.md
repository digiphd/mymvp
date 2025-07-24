# MyMVP API

Express API for handling MyMVP application form submissions with Loops.so email integration and Supabase database storage.

## Features

- ✅ **Secure API**: API key authentication, rate limiting, CORS protection
- ✅ **Form Validation**: Joi schema validation with detailed error messages
- ✅ **Lead Qualification**: Automated scoring and routing logic
- ✅ **Email Integration**: Loops.so transactional emails
- ✅ **Database Storage**: Supabase PostgreSQL with full schema
- ✅ **Error Handling**: Comprehensive error logging and user-friendly responses
- ✅ **Vercel Ready**: Optimized for serverless deployment

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `API_SECRET_KEY`: Your secret API key for authentication
- `LOOPS_API_KEY`: Your Loops.so API key
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `CORS_ORIGIN`: Your frontend domain (e.g., https://mymvp.io)

### 3. Set Up Database

Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy content from database/schema.sql
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### POST /api/applications

Submit a new MVP application.

**Headers:**
```
Content-Type: application/json
x-api-key: your-api-key-here
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "company": "Acme Inc",
  "prd_content": "Comprehensive PRD content (min 500 chars)...",
  "budget_timeline": "5k_2weeks",
  "project_readiness": "ready_collaboration",
  "technical_preferences": "Optional technical requirements"
}
```

**Response:**
```json
{
  "status": "success",
  "qualification": "highly_qualified",
  "message": "Perfect! You're exactly the type of founder we love working with.",
  "next_action": "calendar_booking",
  "calendar_url": "https://calendly.com/mymvp/discovery-call"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

## Qualification Logic

Applications are automatically qualified based on:

**Highly Qualified** (Calendar booking):
- Budget: $5K+ (2 weeks) or $10K+ (flexible)
- Readiness: Ready for collaboration
- PRD: Complete (500+ characters)

**Qualified** (Manual review):
- Budget: $2-5K (1 month)
- Readiness: Ready for collaboration
- PRD: Adequate

**Unqualified** (Polite rejection):
- Budget: Under $2K or exploring
- Readiness: Hands-off or wants marketing
- PRD: Incomplete

## Email Templates

Configure these templates in Loops.so:

1. **application_confirmation**: Sent to applicants
2. **new_application_admin**: Sent to admin

Template variables are passed automatically based on the application data.

## Database Schema

The `applications` table stores:
- Contact information (name, email, company)
- PRD content and preferences
- Qualification level and timestamps
- Proper indexing and RLS policies

## Security Features

- **API Key Authentication**: Required for all endpoints
- **Rate Limiting**: 10 requests per minute per IP
- **CORS Protection**: Restricted to your domain
- **Input Validation**: Joi schema validation
- **Request Size Limits**: 10MB max payload
- **Security Headers**: Helmet.js protection

## Error Handling

The API provides detailed error responses:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

The `vercel.json` configuration is already included.

### Manual Deployment

```bash
npm run build
npm start
```

## Development Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run lint     # Run ESLint
```

## Monitoring

The API logs all important events:
- ✅ Successful applications
- ❌ Validation failures
- 📧 Email delivery status
- 💾 Database operations
- 🚨 Errors and exceptions

Monitor these logs in your deployment platform for insights and debugging.

## Support

For questions or issues:
1. Check the logs for error details
2. Verify environment variables are set correctly
3. Test with the health check endpoint
4. Ensure Supabase database schema is applied

## License

Private - MyMVP Internal Use Only