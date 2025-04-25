import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    );
  }

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, start, end, progress, projectId } = body;

  if (!name || !start || !end || !projectId) {
    return NextResponse.json(
      { error: "Name, start, end, and projectId are required" },
      { status: 400 }
    );
  }

  const task = await prisma.task.create({
    data: {
      name,
      start: new Date(start),
      end: new Date(end),
      progress: progress || 0,
      projectId,
    },
  });

  return NextResponse.json(task);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const task = await prisma.task.update({
    where: { id },
    data,
  });

  return NextResponse.json(task);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
