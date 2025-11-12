# Brevo Newsletter Form Setup

This Next.js application uses a direct Brevo form submission without any API intermediaries.

## Configuration Steps

1. **Get Your Brevo Form URL**
   - Log in to your Brevo account
   - Go to Forms section
   - Find form ID 1 or create a new form
   - Click "Get the code" or "Share"
   - Copy the form action URL (it looks like: `https://f07eec19.sibforms.com/serve/MUIFAFgrj2Q7...`)

2. **Update the Form Action**
   - Open `components/brevo-newsletter-form.tsx`
   - Replace the `defaultFormAction` value with your actual Brevo form URL:
     \`\`\`tsx
     const defaultFormAction = formAction || "YOUR_BREVO_FORM_URL_HERE"
     \`\`\`

3. **How It Works**
   - User enters their email
   - Form submits directly to Brevo's servers (no-cors mode)
   - Brevo handles the subscription and sends confirmation email
   - User sees success message in the UI

## Features

- ✅ Direct submission to Brevo (no API keys needed)
- ✅ Email validation
- ✅ Honeypot spam protection
- ✅ Loading states and success/error messages
- ✅ Accessible form fields with labels
- ✅ Responsive design matching your site theme
- ✅ Works identically to WordPress `[sibwp_form id=1]` shortcode

## Usage

The form is already integrated in:
- Homepage newsletter section (`components/newsletter.tsx`)
- Newsletter modal (`components/newsletter-modal.tsx`)
- Blog post sidebar (`components/blog-detail.tsx`)

No additional configuration needed after setting the form URL!
