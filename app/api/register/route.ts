import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (request: NextRequest) => {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return new NextResponse("Name, email, and password are required", {
        status: 400,
      });
    }
    const existingUser = await prisma?.user?.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }
    const salt = await bcryptjs?.genSalt(10);
    const hashedPassword = await bcryptjs?.hash(password, salt);

    const newUser = await prisma?.user?.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return new NextResponse("User registered successfully", { status: 201 });
  } catch (error) {
    return new NextResponse("User registration failed", { status: 500 });
  }
};
