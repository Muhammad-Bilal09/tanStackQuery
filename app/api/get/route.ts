import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const todos = await prisma?.todo?.findMany();
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos." },
      { status: 500 }
    );
  }
}
