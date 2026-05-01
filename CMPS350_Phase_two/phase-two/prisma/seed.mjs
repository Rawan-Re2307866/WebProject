import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./client/index.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const hashedPassword = await bcrypt.hash("Password1!", 10);

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "",
  }),
});

const seed = async () => {
  const users = [];
    
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username().slice(0, 20).replace(/[^a-zA-Z0-9_]/g, "_"),
        email: faker.internet.email(),
        password: hashedPassword,
        bio: faker.lorem.sentence(),
        profilePicture: "/images/prof1.png",
        createdAt: faker.date.between({ from: "2024-01-01", to: new Date() }),
      },
    });
    users.push(user);
  }

  for (const user of users) {
    const others = users.filter((u) => u.id !== user.id);
    const toFollow = faker.helpers.arrayElements(others, { min: 2, max: 5 });
    for (const target of toFollow) {
      await prisma.follow.upsert({
        where: { followerId_followingId: { followerId: user.id, followingId: target.id } },
        update: {},
        create: { followerId: user.id, followingId: target.id },
      });
    }
  }
const posts = [];
for (const user of users) {
  const count = faker.number.int({ min: 2, max: 8 });
  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(["text", "image"]);
    const post = await prisma.post.create({
      data: {
        type,
        content: type === "image"
          ? `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/600/600`
          : faker.lorem.paragraph(),
        caption: faker.lorem.sentence(),
        userId: user.id,
        createdAt: faker.date.between({ from: "2024-06-01", to: new Date() }),
      },
    });
    posts.push(post);
  }
}

  for (const user of users) {
    const toLike = faker.helpers.arrayElements(posts, { min: 3, max: 10 });
    for (const post of toLike) {
      await prisma.like.upsert({
        where: { userId_postId: { userId: user.id, postId: post.id } },
        update: {},
        create: { userId: user.id, postId: post.id },
      });
    }
  }

  for (const user of users) {
    const toComment = faker.helpers.arrayElements(posts, { min: 2, max: 6 });
    for (const post of toComment) {
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          userId: user.id,
          postId: post.id,
          createdAt: faker.date.between({ from: "2024-06-01", to: new Date() }),
        },
      });
    }
  }

  console.log("Seeded successfully.");
};

try {
  await seed();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}