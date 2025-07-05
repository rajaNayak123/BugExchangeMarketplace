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
## 🚀 Live Demo
![Bug Exchange Marketplace](https://bug-exchange-marketplace.vercel.app/)
---

## 🚀 Features

### 🔐 Authentication
- **GitHub OAuth** - Sign in with your GitHub account
- **Credentials Auth** - Traditional email/password signup
- **Protected Routes** - Secure access to posting and submission features

### 🐛 Bug Management
- **Post Bugs** - Create detailed bug reports with stack traces and code snippets
- **Set Bounties** - Offer monetary rewards for bug fixes (minimum ₹100)
- **Tag System** - Categorize bugs with relevant technology tags
- **Status Tracking** - Track bugs from OPEN → CLAIMED → RESOLVED

### 💡 Solution System
- **Submit Fixes** - Developers can claim bugs and submit solutions
- **Review Process** - Bug authors can approve or reject submissions
- **Quality Control** - Detailed solution descriptions and code required

### 🏆 Reputation System
- **Earn Reputation** - Gain reputation points for approved submissions
- **Leaderboard** - Top developers showcase based on reputation
- **Trust Building** - Higher reputation = more credibility

### 💳 Payment Integration
- **Razorpay Integration** - Secure payment processing for bounties
- **Escrow System** - Payments held until solutions are approved
- **Instant Payouts** - Automatic payment release on approval

### 🔍 Advanced Search
- **Keyword Search** - Find bugs by title and description
- **Tag Filtering** - Filter by technology stack
- **Bounty Range** - Search within specific bounty amounts
- **Real-time Results** - Instant search as you type

### 📊 Dashboard & Analytics
- **User Dashboard** - Track your posted bugs and submissions
- **Activity Feed** - See recent platform activity
- **Statistics** - Comprehensive stats on earnings and reputation
- **Profile Management** - Manage your developer profile

## 🛠 Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Razorpay
- **UI Components**: shadcn/ui + Tailwind CSS
- **Validation**: Zod
- **Icons**: Lucide React

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- GitHub OAuth App credentials
- Razorpay account and API keys

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bug-exchange-marketplace.git
cd bug-exchange-marketplace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment variables file:

```bash
cp .env.example .env
```

Fill in your environment variables in \`.env\`:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/bug-exchange"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Razorpay
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"

# Gmail for Email
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-character-app-password"
```

### 4. Database Setup

Push the database schema:

```bash
npx prisma db push
```

**Seed the database with sample data:**

```bash
npm run db:seed
```

This will create:
- 4 sample users (john@example.com, jane@example.com, bob@example.com, alice@example.com)
- 5 sample bugs with different technologies
- 3 sample submissions (some approved, some pending)
- 2 sample payments
- All passwords are: **password123**

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌱 Database Seeding

### Available Commands:

```bash
# Seed database with sample data
npm run db:seed

# Reset database and seed fresh data
npm run db:reset

# View database in Prisma Studio
npm run db:studio
```

### Sample Data Includes:

- **4 Users** with different reputation levels
- **5 Bugs** covering various technologies (React, MongoDB, CSS, Next.js, TypeScript)
- **3 Submissions** with different statuses
- **2 Payments** (completed)
- **Test credentials** for easy login

### Test Accounts:

| Email | Password | Reputation | Role |
|-------|----------|------------|------|
| john@example.com | password123 | 150 | Bug Author |
| jane@example.com | password123 | 205 | Top Solver |
| bob@example.com | password123 | 75 | New User |
| alice@example.com | password123 | 303 | Expert |

## 🔧 Configuration

### GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - **Homepage URL**: \`http://localhost:3000\`
   - **Authorization callback URL**: \`http://localhost:3000/api/auth/callback/github\`
3. Copy the Client ID and Client Secret to your \`.env\` file

### Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your API keys from the dashboard
3. Add both the secret key and public key to your \`.env\` file

### MongoDB Setup

**Option 1: MongoDB Atlas (Recommended)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and add it to \`DATABASE_URL\`

**Option 2: Local MongoDB**
1. Install MongoDB locally
2. Use \`mongodb://localhost:27017/bug-exchange\` as your \`DATABASE_URL\`

## 📁 Project Structure

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

## 🎯 Usage Guide

### For Bug Posters

1. **Sign Up/Login** - Create an account or sign in with GitHub
2. **Post a Bug** - Click "Post Bug" and fill in the details:
   - Clear title and description
   - Stack trace (if available)
   - Code snippet or repository link
   - Set bounty amount (minimum ₹100)
   - Add relevant tags
3. **Fund Bounty** - Pay the bounty amount via Razorpay
4. **Review Submissions** - Check submitted solutions and approve/reject
5. **Automatic Payment** - Approved submissions receive payment automatically

### For Solution Providers

1. **Browse Bugs** - Use search and filters to find bugs you can fix
2. **Submit Solution** - Provide detailed description and code solution
3. **Earn Reputation** - Get reputation points for approved submissions
4. **Get Paid** - Receive bounty payments instantly on approval

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to update these for production:

- `NEXTAUTH_URL` - Your production domain
- `DATABASE_URL` - Production MongoDB connection string
- All other variables remain the same

## 📊 Database Schema

The application uses the following main models:

- **User** - User accounts with reputation
- **Bug** - Bug reports with bounties
- **Submission** - Solution submissions
- **Payment** - Payment tracking
- **Account/Session** - NextAuth session management

## 🔒 Security Features

- **Input Validation** - All forms validated with Zod
- **Authentication** - Secure session management
- **Protected Routes** - API and page protection
- **Payment Security** - Razorpay signature verification
- **SQL Injection Prevention** - Prisma ORM protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset and seed database

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
- Verify your `DATABASE_URL` is correct
- Check if MongoDB is running (for local setup)
- Ensure IP whitelist is configured (for MongoDB Atlas)

**Authentication Issues**
- Verify GitHub OAuth app configuration
- Check `NEXTAUTH_SECRET` is set
- Ensure callback URLs match

**Payment Issues**
- Verify Razorpay API keys
- Check if `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Test with Razorpay test mode first

**Seeding Issues**
- Make sure database is connected
- Run `npx prisma db push` first
- Check for existing data conflicts

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Razorpay](https://razorpay.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/yourusername/bug-exchange-marketplace/issues) page
2. Create a new issue if your problem isn't already reported
3. Join our community discussions

---

**Happy Bug Hunting! 🐛💰**

Made with ❤️ by developers, for developers.
