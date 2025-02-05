import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todoId = params?.id;

    await prisma?.todo?.delete({
      where: { id: todoId },
    });

    return NextResponse.json(
      { message: "Todo deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo." },
      { status: 500 }
    );
  }
}
