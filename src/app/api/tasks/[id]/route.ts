import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
