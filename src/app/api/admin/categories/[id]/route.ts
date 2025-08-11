import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { request } from "http";

//Next.js（App Router）+ Prisma ORMを使ったカテゴリー管理用のAPIルート（/api/admin/categories/[id]）
//１つのidを持つカテゴリーに対して、取得(GET),更新(PUT),削除(DELETE)を行うAPIを定義
const prisma = new PrismaClient();

//管理者カテゴリー個別取得API
//カテゴリー1件の取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });//URLのidパラメータをintに変換し、Prismaでid一致のデータを取得。
    return NextResponse.json({ status: "OK", category });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message });
  }
};

interface UpdateCategoryRequestBody {
  name: string;
}
//管理者　カテゴリー更新API
//カテゴリーの名前を更新
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { name }: UpdateCategoryRequestBody = await request.json();//リクエストボディからnameを取り出し、該当カテゴリーの名前を更新します。
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

//管理者　カテゴリー削除API
//カテゴリーの削除
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