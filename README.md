# 🐞 Bug Exchange Marketplace for Developers

A modern platform where developers can post bugs with bounties and earn money by fixing them. Built with Next.js, TypeScript, MongoDB, and Razorpay.

## 🧠 Problem

Developers often get stuck on tricky bugs that waste hours of productivity. Finding someone to help is either slow or expensive.

---

## ✅ Solution

A collaborative bug-fixing marketplace where:

- Developers post bugs with a bounty.
- Other devs claim bugs and submit fixes.
- Posters review submissions and release rewards.

---

## 🧩 Key Features

### 🐛 Bug Posting

- Title, description, stack trace, code snippet
- GitHub repo link + optional screenshots/video
- Tech stack tags (React, Node.js, etc.)
- Bounty amount

### 🧑‍💻 Claim & Submit Fix

- Claim any unclaimed bug
- Submit fix description + GitHub commit/PR link
- Poster reviews and accepts/rejects

### 🌟 Developer Reputation

- Earn points for every accepted bug fix
- Leaderboard to rank top devs
- Public dev profile with stats

### 💳 Payments (Razorpay Integration)

- Secure payment processing with Razorpay
- Real-time payment verification
- Automatic bounty release upon acceptance

### 🔍 Search & Filter

- Search by keyword or tags
- Filter by bounty, status (open/claimed/fixed)

---

## 🛠️ Tech Stack

**Frontend**:

- [Next.js (App Router)](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

**Backend**:

- [Next.js API Routes] OR [Express Microservices]
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [Razorpay](https://razorpay.com/) for payment processing
- [NextAuth.js](https://next-auth.js.org/) for OAuth

**Other Tools**:

- [Cloudinary](https://cloudinary.com/) – for screenshots/videos
- [GitHub](https://github.com/) – for bug fix links
- [Resend / Nodemailer](https://resend.com/) – for notifications (optional)

---

## 🔧 Environment Setup
<<<<<<< HEAD

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/bugexchange"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth (for authentication)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Razorpay (for payments) - REQUIRED for payment functionality
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"

# Email (for notifications)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-gmail-app-password"
```

### Getting Razorpay Keys:

1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to Settings → API Keys
3. Generate a new key pair
4. Use the Key ID and Key Secret in your environment variables

---

## 📁 Folder Structure (App Router)

```
bug-exchange-marketplace/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── bugs/              # Bug-related pages
│   ├── dashboard/         # User dashboard
│   └── profile/           # User profile
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── validations.ts    # Zod schemas
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── scripts/              # Database scripts
    └── seed.ts           # Database seeding
```

---

## 🐛 Troubleshooting

**Payment Issues**

- Verify Razorpay API keys
- Check if `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Test with Razorpay test mode first

**Database Connection Issues**

- Verify your `DATABASE_URL` is correct
- Check if MongoDB is running (for local setup)
- Ensure IP whitelist is configured (for MongoDB Atlas)

**Authentication Issues**

- Verify GitHub OAuth app configuration
- Check `NEXTAUTH_SECRET` is set
- Ensure callback URLs match

---

**Happy Bug Hunting! 🐛💰**

Made with ❤️ by developers, for developers.
=======

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/bugexchange"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth (for authentication)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Razorpay (for payments) - REQUIRED for payment functionality
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"

# Email (for notifications)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-gmail-app-password"
```

### Getting Razorpay Keys:

1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to Settings → API Keys
3. Generate a new key pair
4. Use the Key ID and Key Secret in your environment variables

---

## 📁 Folder Structure (App Router)
>>>>>>> d449a45e6e7de156b7fa7ce778835eb5b0cad14e
