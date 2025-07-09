import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

//Prismaクライアント生成
//PrismaORMを通じてデータベースにアクセスするためのクライアント
const prisma = new PrismaClient();

//全体の概要
//Prisma ORMを使って、記事データ(Post)を取得(GET)または作成(POST)する。記事はカテゴリ(Category)と多対多のリレーションを持ち、中間テーブルpostCategoryを通じて接続する。

//管理者　記事一覧取得API
//GETリクエスト処理:記事一覧の取得
export const GET = async (request: NextRequest) => {
  try {
    //post.findMany()を使って全記事を取得。
    //各記事が持つpostCategories(中間テーブル)と、その中のcategory情報(id,name)をincludeで取得。
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      //作成日時で降順(新しい順)に並び替え
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ status: "OK", posts: posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
// 記事作成のリクエストボディの型を定義(受け取るリクエストボディ)
interface CreatePostRequestBody {
  title: string;
  content: string;
  categories: { id: number }[];//オブジェクトの配列
  thumbnailUrl: string;
}

// POSTという命名にすることで、POSTリクエストの時にこの関数が呼ばれる
//管理者　記事新規作成API
//POSTリクエスト処理:記事の新規作成
export const POST = async (request: NextRequest, context: any) => {
  try {
    // リクエストのbodyを取得
    const body = await request.json();

    // bodyの中からtitle, content, categories, thumbnailUrlを取り出す
    const { title, content, categories, thumbnailUrl }: CreatePostRequestBody =
      body;

    // 投稿をDBに生成
    //記事本体(title,content,thumbnailUrl)をpost.create()で作成。
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    //各カテゴリーIDと新規記事IDの組を使って、postCategory.create()をfor文で実行
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      });
    }

    // レスポンスを返す
    return NextResponse.json({
      status: "OK",
      message: "作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};