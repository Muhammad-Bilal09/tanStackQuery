import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Both title and description are required." },
        { status: 400 }
      );
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(
      { message: "Todo added successfully!", newTodo },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding todo:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the todo." },
      { status: 500 }
    );
  }
}
