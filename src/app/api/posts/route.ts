// Next.jsのAPIルートでリクエストやレスポンスを扱うためのオブジェクトをインポート
import { NextRequest, NextResponse } from 'next/server'
// Prisma ORM を使ってデータベースにアクセスするためのクライアントをインポート
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
// ブログ全記事取得API
export const GET = async (request: NextRequest) => {
  try {
    // Postの一覧をDBから取得(findManyはDBから全記事取得メソッド)
    const posts = await prisma.post.findMany({
      include: {
        // カテゴリーも含めて取得
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
      // 作成日時の降順で取得
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
