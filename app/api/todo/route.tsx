import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

// GET: Fetch all ToDos for the logged-in user
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todos = await prisma.toDo.findMany({
    where: { user: { email: session.user.email } },
  });

  return NextResponse.json(todos);
}

// POST: Create a new ToDo
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();
  const newTodo = await prisma.toDo.create({
    data: {
      title,
      user: { connect: { email: session.user.email } },
    },
  });

  return NextResponse.json(newTodo, { status: 201 });
}

// PATCH: Update ToDo completion status
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, completed } = await req.json();
  console.log(id, completed);
  const updatedTodo = await prisma.toDo.update({
    where: { id },
    data: { completed },
  });

  return NextResponse.json(updatedTodo);
}

// DELETE: Remove a ToDo
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  await prisma.toDo.delete({
    where: { id },
  });
  // 204 No Contentなので、レスポンスボディは空
  return new NextResponse(null, { status: 204 });
}
