import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

//Prisma ORM を使うためのクライアントを作成。
const prisma = new PrismaClient()

//全体の概要
//APIルートで、指定された記事ID(id)に対応する記事データをPrisma ORMを使ってデータベースから取得し、JSON形式で返す処理

//AppRouterのGETメソッド
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }, // ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているので、それを取り出し、受け取る(例:/api/posts/123ならid=123)
  const { id } = params

  try {
    //findUniqueで主キー(ここではid)を元にPostのレコードをDBから取得
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      // カテゴリーも含めて取得
      //同時に、中間テーブルpostCategoriesと、その先のcategoryテーブルをリレーションとして取得。
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                //selectを使い、categoryからidとnameだけ取得。不要なフィールドを省略
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', post: post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}