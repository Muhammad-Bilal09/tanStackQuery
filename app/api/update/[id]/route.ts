import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description } = await req.json();
    const updatedTodo = await prisma?.todo?.update({
      where: { id: params?.id },
      data: { title, description },
    });

    return NextResponse.json(
      { message: "Todo updated successfully!", updatedTodo },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo." },
      { status: 500 }
    );
  }
}
