// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@test.com",
      password: "admin123",
      role: "ADMIN",
    },
  });

  const users = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: "user123",
          role: "CANDIDATE",
        },
      })
    )
  );

  const jobs = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.job.create({
        data: {
          title: faker.person.jobTitle(),
          description: faker.lorem.sentences(2),
          postedById: admin.id,
        },
      })
    )
  );

  await prisma.application.create({
    data: {
      jobId: jobs[0].id,
      userId: users[0].id,
    },
  });

  console.log("✅ Database seeded!");
}

main().finally(() => prisma.$disconnect());
