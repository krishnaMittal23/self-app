# Self Authentication App

This is a Next.js application that integrates Self Protocol for identity verification and authentication.

## Project Structure
- Frontend: Next.js with TypeScript
- Authentication: Self Protocol SDK (@selfxyz/qrcode, @selfxyz/core)
- Backend: Next.js API routes for proof verification

## Key Features
- QR code generation for identity verification
- Mobile-first authentication flow
- Backend proof verification
- Age verification (minimum 18)
- Nationality and gender disclosure

## Development Setup
1. Install dependencies: `npm install`
2. Configure environment variables in `.env.local`
3. Use ngrok for local development: `ngrok http 3000`
4. Update endpoint URLs in environment variables
5. Run development server: `npm run dev`

## Authentication Flow
1. Display QR code using Self SDK
2. User scans with Self app
3. Backend verifies zero-knowledge proof
4. Success callback triggers on verification completion

## Important Notes
- Endpoint must be publicly accessible (use ngrok for local dev)
- Users need Self mobile app with verified identity documents
- Minimum age requirement is 18 for this demo