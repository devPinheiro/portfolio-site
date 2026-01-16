# Contact Form Setup - Samuel Pinheiro Portfolio

## ✅ What's Been Implemented

### 1. **Email Service Integration**
- **Resend API integration** for production email sending
- **Development simulation** for testing without API keys
- **Error handling** and validation

### 2. **Contact Form Features**
- ✅ **Form validation** (name, email, message requirements)
- ✅ **Real-time error feedback** with visual indicators
- ✅ **Loading states** during submission
- ✅ **Success/error messages** with icons
- ✅ **Auto-reset** after successful submission
- ✅ **Professional styling** matching Dennis Snellenberg design

### 3. **Files Created/Updated**

#### New Files:
- `/server.js` - Express server with Resend integration
- `/api/contact.js` - Serverless function for Vercel deployment
- `/src/utils/emailService.ts` - Email service with dev simulation
- `/test-contact.html` - Standalone test page
- `/.env.example` - Environment variables template

#### Updated Files:
- `/src/components/ui/ContactOverlay.tsx` - Full integration with validation
- `/package.json` - Added server scripts and dependencies

## 🚀 How to Test

### Option 1: Standalone Test (Works Now)
```bash
# Open the test page in browser
open test-contact.html
```
This test page simulates the full contact form experience with:
- Form validation
- Loading states
- Success/error feedback
- 90% simulated success rate

### Option 2: Full Development Setup (Requires Node 20+)
```bash
# 1. Update Node.js version
nvm install --lts
nvm use --lts

# 2. Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your Resend API key

# 4. Run both servers
npm run dev:full
```

### Option 3: Production Deployment
Deploy to **Vercel** (recommended):
1. Connect your repo to Vercel
2. Add `RESEND_API_KEY` environment variable in Vercel dashboard
3. The `/api/contact.js` endpoint will work automatically

## 📧 Resend Setup

1. **Get API Key**: https://resend.com/api-keys
2. **Update .env**: Add `RESEND_API_KEY=your_key_here`
3. **Update email addresses** in `/server.js` or `/api/contact.js`:
   ```javascript
   from: 'Portfolio Contact <noreply@yourdomain.com>',
   to: ['samuel.pinheiro@yourdomain.com'],
   ```

## 🎨 Form Features in Action

### ContactOverlay Component:
- **Fullscreen overlay** with clipPath animations
- **Smooth GSAP transitions** for form elements
- **Real-time validation** with error highlighting
- **Professional button animations** (Dennis Snellenberg style)
- **Loading spinner** during submission
- **Success checkmark** with auto-close
- **Error handling** with retry capability

### Email Template:
- **Professional HTML design** with portfolio branding
- **Structured contact information** (name, email, company)
- **Clean message formatting** with proper spacing
- **Reply-friendly** setup for easy responses

## 🔧 Technical Details

### Development Mode:
- Uses `emailService.ts` with simulation
- No API keys required for testing
- Console logging for debugging
- 1.5s delay to simulate network

### Production Mode:
- Automatic Resend integration
- Proper error handling and logging
- CORS configured for frontend
- Validation on both client and server

The contact form is now fully functional and ready for deployment! 🚀