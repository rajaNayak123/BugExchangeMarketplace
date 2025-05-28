# 🐞 Bug Exchange Marketplace for Developers

A full-stack platform where developers can **post bugs with bounties** and other developers can **claim and fix them** for rewards. Think of it as a bug bounty platform, but for everyday dev issues.

---

## 🚀 Live Demo

Coming Soon...

---

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

### 💳 Payments (Simulated)
- Bounty is marked as "held" until accepted
- Stripe test-mode or dummy confirmation

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
- [Stripe (Test mode)](https://stripe.com/) for payment simulation  
- [NextAuth.js](https://next-auth.js.org/) for OAuth

**Other Tools**:  
- [Cloudinary](https://cloudinary.com/) – for screenshots/videos  
- [GitHub](https://github.com/) – for bug fix links  
- [Resend / Nodemailer](https://resend.com/) – for notifications (optional)

---

## 📁 Folder Structure (App Router)

