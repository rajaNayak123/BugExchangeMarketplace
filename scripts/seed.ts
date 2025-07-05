"use client";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 12);

    console.log("👤 Creating sample users...");

    const user1 = await prisma.user.upsert({
      where: { email: "john@example.com" },
      update: {},
      create: {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        reputation: 150,
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: "jane@example.com" },
      update: {},
      create: {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        reputation: 200,
      },
    });

    const user3 = await prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: {
        name: "Bob Wilson",
        email: "bob@example.com",
        password: hashedPassword,
        reputation: 75,
      },
    });

    const user4 = await prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: hashedPassword,
        reputation: 300,
      },
    });

    console.log("✅ Sample users created");

    // Create sample bugs
    console.log("🐛 Creating sample bugs...");

    const bug1 = await prisma.bug.create({
      data: {
        title: "React useState not updating component",
        description:
          "I have a React component where useState is not triggering re-renders. The state value changes but the component doesn't update. This happens specifically when I'm updating an object in state.",
        stackTrace: `Error: Component not re-rendering
    at useState hook
    at MyComponent.render
    at React.createElement`,
        repoSnippet: `const [count, setCount] = useState(0);
const handleClick = () => {
  setCount(count + 1); // This doesn't trigger re-render
};

return (
  <div>
    <p>Count: {count}</p>
    <button onClick={handleClick}>Increment</button>
  </div>
);`,
        bountyAmount: 500,
        tags: ["React", "JavaScript", "Frontend", "useState"],
        authorId: user1.id,
      },
    });

    const bug2 = await prisma.bug.create({
      data: {
        title: "MongoDB connection timeout in production",
        description:
          "MongoDB connection keeps timing out in production environment. Works fine locally but fails on server. The error occurs after about 30 seconds of inactivity.",
        stackTrace: `MongoTimeoutError: Server selection timed out after 30000 ms
    at Timeout._onTimeout (/node_modules/mongodb/lib/sdam/topology.js:293:38)
    at listOnTimeout (internal/timers.js:557:17)
    at processTimers (internal/timers.js:500:7)`,
        repoSnippet: `mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connection fails after 30 seconds
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));`,
        bountyAmount: 1000,
        tags: ["MongoDB", "Node.js", "Backend", "Database"],
        authorId: user2.id,
      },
    });

    const bug3 = await prisma.bug.create({
      data: {
        title: "CSS Flexbox alignment issue on mobile",
        description:
          "Flexbox items are not aligning properly on mobile devices. Desktop looks fine but mobile layout breaks. The items stack vertically instead of horizontally on screens smaller than 768px.",
        repoSnippet: `.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.item {
  flex: 1;
  min-width: 200px;
}

/* This breaks on mobile */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}`,
        bountyAmount: 300,
        tags: ["CSS", "Frontend", "Mobile", "Flexbox"],
        authorId: user3.id,
      },
    });

    const bug4 = await prisma.bug.create({
      data: {
        title: "Next.js API route returning 404 in production",
        description:
          "API routes work perfectly in development but return 404 in production build. The routes are in the correct app/api directory structure.",
        stackTrace: `404 - This page could not be found.
    at /api/users/profile
    at production build`,
        repoSnippet: `// app/api/users/profile/route.ts
export async function GET(request: Request) {
  return Response.json({ message: "Hello World" });
}

// This works in dev but not in production`,
        bountyAmount: 750,
        tags: ["Next.js", "API", "Production", "Deployment"],
        authorId: user4.id,
      },
    });

    const bug5 = await prisma.bug.create({
      data: {
        title: "TypeScript generic type inference failing",
        description:
          "TypeScript is not properly inferring generic types in a utility function. The function should infer the return type based on the input parameter.",
        repoSnippet: `function processData<T>(data: T[]): ProcessedData<T> {
  return data.map(item => ({
    ...item,
    processed: true
  }));
}

// TypeScript can't infer T properly
const result = processData([{ id: 1, name: "test" }]);`,
        bountyAmount: 400,
        tags: ["TypeScript", "Generics", "Types", "JavaScript"],
        authorId: user1.id,
      },
    });

    console.log("✅ Sample bugs created");

    // Create sample submissions
    console.log("📝 Creating sample submissions...");

    const submission1 = await prisma.submission.create({
      data: {
        description:
          "The issue is with the useState callback. You need to use the functional update pattern to avoid stale closures.",
        solution: `const handleClick = () => {
  setCount(prevCount => prevCount + 1); // Use functional update
};

// Alternative solution using useCallback
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]);

// Or use useReducer for complex state
const [state, dispatch] = useReducer(reducer, initialState);`,
        status: "APPROVED",
        bugId: bug1.id,
        submitterId: user2.id,
      },
    });

    const submission2 = await prisma.submission.create({
      data: {
        description:
          "This looks like a connection pool issue. Try adjusting the MongoDB connection settings and adding proper error handling.",
        solution: `mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
});

// Add connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});`,
        status: "PENDING",
        bugId: bug2.id,
        submitterId: user3.id,
      },
    });

    const submission3 = await prisma.submission.create({
      data: {
        description:
          "The flexbox issue can be solved by adjusting the media query and using proper flex properties.",
        solution: `.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.item {
  flex: 1 1 200px; /* grow, shrink, basis */
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .item {
    flex: 1 1 auto;
    width: 100%;
  }
}`,
        status: "APPROVED",
        bugId: bug3.id,
        submitterId: user4.id,
      },
    });

    console.log("✅ Sample submissions created");

    // Update bug statuses for approved submissions
    await prisma.bug.update({
      where: { id: bug1.id },
      data: { status: "RESOLVED" },
    });

    await prisma.bug.update({
      where: { id: bug3.id },
      data: { status: "RESOLVED" },
    });

    // Update user reputations for approved submissions
    await prisma.user.update({
      where: { id: user2.id },
      data: { reputation: { increment: 5 } }, // 5 rep for ₹500 bounty
    });

    await prisma.user.update({
      where: { id: user4.id },
      data: { reputation: { increment: 3 } }, // 3 rep for ₹300 bounty
    });

    console.log("✅ Updated bug statuses and user reputations");

    // Create some sample payments
    console.log("💳 Creating sample payments...");

    await prisma.payment.create({
      data: {
        razorpayOrderId: "order_sample_1",
        razorpayPaymentId: "pay_sample_1",
        amount: 500,
        status: "COMPLETED",
        bugId: bug1.id,
        userId: user1.id,
      },
    });

    await prisma.payment.create({
      data: {
        razorpayOrderId: "order_sample_2",
        amount: 300,
        status: "COMPLETED",
        bugId: bug3.id,
        userId: user3.id,
      },
    });

    console.log("✅ Sample payments created");

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`👤 Users created: 4`);
    console.log(`🐛 Bugs created: 5`);
    console.log(`📝 Submissions created: 3`);
    console.log(`💳 Payments created: 2`);
    console.log(`✅ Resolved bugs: 2`);
    console.log(`⏳ Pending bugs: 3`);

    console.log("\n🔐 Test Credentials:");
    console.log("Email: john@example.com | Password: password123");
    console.log("Email: jane@example.com | Password: password123");
    console.log("Email: bob@example.com | Password: password123");
    console.log("Email: alice@example.com | Password: password123");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  });
