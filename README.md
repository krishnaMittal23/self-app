# Self Authentication Demo

A Next.js application demonstrating secure, privacy-preserving identity verification using Self Protocol. This app allows users to prove their age, nationality, and other attributes without revealing their personal information through zero-knowledge proofs.

## Features

- **Privacy-Preserving**: Uses zero-knowledge proofs to verify identity without revealing personal data
- **QR Code Authentication**: Simple scan-to-verify process using the Self mobile app  
- **Age Verification**: Verify users are 18+ without revealing exact age
- **Nationality & Gender Disclosure**: Prove nationality and gender attributes
- **Real-time Verification**: Instant feedback with LED status indicators

## Prerequisites

Before you begin, ensure you have:
- **Node.js 16+** installed
- **Self mobile app** downloaded from your app store
- **Verified identity document** in the Self app (passport, ID card, etc.)

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
3. **Configure Public Endpoint** (Required for verification)
   
   For local development, use ngrok:
   ```bash
   # Install ngrok globally
   npm install -g ngrok
   
   # Start your Next.js app
   npm run dev
   
   # In another terminal, expose your local server
   ngrok http 3000
   ```
   
   Update `.env.local` with your ngrok URL:
   ```env
   NEXT_PUBLIC_SELF_ENDPOINT=https://abc123.ngrok.io/api/verify
   SELF_ENDPOINT=https://abc123.ngrok.io/api/verify
   ```

4. **Start the Application**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

The app demonstrates Self Protocol's privacy-preserving authentication:

1. **Display QR Code**: Generate verification request
2. **Scan with Self App**: User scans with mobile app  
3. **Zero-Knowledge Proof**: Prove attributes without revealing data
4. **Backend Verification**: API verifies cryptographic proof
5. **Success Response**: Complete verification flow

## Configuration

Update `.env.local` with your settings:

```env
NEXT_PUBLIC_SELF_APP_NAME=Your App Name
NEXT_PUBLIC_SELF_SCOPE=your-unique-scope  
NEXT_PUBLIC_SELF_ENDPOINT=https://your-domain.com/api/verify
```

## Important Notes

- **Public Endpoint Required**: The verification endpoint must be publicly accessible (not localhost)
- **Self Mobile App**: Users need the Self app installed with verified identity documents
- **Age Requirement**: Demo requires 18+ age verification

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
