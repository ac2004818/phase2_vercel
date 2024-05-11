// pages/api/auth/login.js

import { PrismaClient } from "@prisma/client";

export async function POST(request) {
  const prisma = new PrismaClient();

  const { username, password } = await request.json();
  let user = {};
  try {
    try {
      user = await prisma.buyer.findUnique({
        where: {
          username,
        },
      });
    } catch (error) {
      user = await prisma.transaction.findMany({
        where: {
          id: 1,
        },
      });
    }
    if (!user && (user ?? {}).password !== password) {
      try {
        user = await prisma.seller.findUnique({
          where: {
            username: username,
          },
        });
      } catch (error) {
        user = await prisma.seller.findMany({
          where: {
            username: username,
          },
        });
      }
      // If user is not found or password is incorrect for seller as well, throw an error
      if (!user || (user ?? {}).password !== password) {
        throw new Error(
          `Invalid username or password a ${username} ${password}`
        );
      }
    }

    Response.statusCode = 200;
    prisma.$disconnect();
    return Response.json(user);
  } catch (error) {
    prisma.$disconnect();
    // Response.statusCode = 401;
    return Response.json({ error: error.message });
  }
}
