# Email Setup for Resend - Complete Guide

## What's Been Done
✅ Updated `script.js` to send form data to `/api/contact` endpoint
✅ Created `package.json` with Resend dependency
✅ Created `.env.local` with your Resend credentials
✅ Created this setup guide

## Setup Instructions for Vercel Deployment

### Step 1: Rename the API File
When deploying to Vercel, you need to create the proper folder structure:

1. Create a new folder named `api` in your project root
2. Create a file `api/contact.js` and copy the content from `contact-api.js`

**On Windows (in PowerShell or CMD):**
```bash
mkdir api
copy contact-api.js api\contact.js
```

**Or manually:**
- Create folder: `sh-softwarewebsite/api/`
- Create file: `sh-softwarewebsite/api/contact.js`
- Copy all content from `contact-api.js` into it

### Step 2: Install Dependencies
```bash
npm install
```

This installs the Resend package needed for email sending.

### Step 3: Test Locally (Optional)
```bash
npm run dev
```

This runs a local Vercel development server where you can test the contact form.

### Step 4: Deploy to Vercel
```bash
vercel deploy --prod
```

### Step 5: Add Environment Variables to Vercel
Go to your Vercel dashboard → Your Project → Settings → Environment Variables

Add these three variables:
- **RESEND_API_KEY**: `re_ED44dGzu_GC84e3QM7Uh6LgNMarDjPYPf`
- **CONTACT_FROM_EMAIL**: `onboarding@resend.dev`
- **CONTACT_TO_EMAIL**: `shsoftwareudvikling@gmail.com`

### Step 6: Redeploy After Adding Environment Variables
After setting environment variables, redeploy:
```bash
vercel deploy --prod
```

## How It Works
1. User fills out the contact form on your website
2. JavaScript sends the form data to `/api/contact`
3. The serverless function receives it
4. Resend API sends an email to `shsoftwareudvikling@gmail.com`
5. The form shows a success message

## Features
- ✅ Validates form fields
- ✅ Sanitizes user input to prevent injection attacks
- ✅ Sends nicely formatted HTML emails
- ✅ Includes reply-to address (user's email)
- ✅ Shows loading state while sending
- ✅ Displays success/error messages

## Troubleshooting
- **"Failed to send email"**: Check that environment variables are set correctly in Vercel
- **CORS errors**: The API handler includes CORS headers, should work fine
- **"Method not allowed"**: Only POST requests are allowed to `/api/contact`

## Files Changed
- `script.js` - Updated form submission handler
- `package.json` - Added (NEW)
- `.env.local` - Added (NEW)
- `vercel.json` - Added (NEW)
- `EMAIL_SETUP.md` - This file (NEW)
- `contact-api.js` - Template file (rename to `api/contact.js` for deployment)

