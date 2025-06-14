import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { request } from "http";

const prisma = new PrismaClient();

//管理者カテゴリー個別取得API
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ status: "OK", category });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message });
  }
};

//管理者カテゴリー更新API
interface UpdateCategoryRequestBody {
  name: string;
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { name }: UpdateCategoryRequestBody = await request.json();
  try {
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });
    return NextResponse.json({ status: "OK", category }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

//管理者カテゴリー削除API
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    // idを指定して、Categoryを削除
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};