import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

//全体の概要
//Prisma ORMを使ってデータベースから全ての投稿記事とその関連カテゴリー情報を取得し、JSON形式でレスポンスとして返すAPI処理

//Prisma ORM を使うためのクライアントを作成。
const prisma = new PrismaClient()

// GETという命名にすることで、GETリクエストの時にこの関数を呼び出す
// ブログ全記事取得API
//  app/api/xxx/route.tsの中でGETメソッドが来たらこの関数が実行。
export const GET = async (request: NextRequest) => {
  try {
    // Postの一覧をDBから取得(findManyはDBから全記事取得メソッド)
    //postテーブルから全ての投稿を取得。
    const posts = await prisma.post.findMany({
      include: {
        // カテゴリーも含めて取得
        //投稿が属するカテゴリーも取得。(中間テーブルpostCategories → category）
        postCategories: {
          include: {
            category: {
              // カテゴリーのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      // 作成日時の降順で取得(新しい記事から順番に)
      orderBy: {
        createdAt: 'desc',
      },
    })
    console.log(posts);
    // レスポンスを返す
    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
