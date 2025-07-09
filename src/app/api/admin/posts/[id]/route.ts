import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//全体の概要
//管理者用「記事の個別取得・更新・削除」API。
// APIルートは /api/admin/posts/[id] に対応、GET・PUT・DELETE の3つのHTTPメソッドを処理


// 管理者　個別記事取得API(GET)
//指定した記事IDに該当する記事＋カテゴリーを取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      //中間テーブルpostCategoriesを通じて、関連カテゴリー(category.id,name)も取得。
      //Prismaのincludeを使用し、関連データを1回のクエリで取得可能に。
      include: {
        postCategories: {
          include: {
            category: {
              //selectにより必要なフィールドだけを取得(効率的に行うため)
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json({ status: "OK", post: post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// 管理者 記事更新API
// 記事の更新時に送られてくるリクエストのbodyの型
interface UpdatePostRequestBody {
  title: string;
  content: string;
  categories: { id: number }[];
  thumbnailUrl: string;
}

// PUTという命名にすることで、PUTリクエストの時にこの関数が呼ばれる
//管理者　記事更新API
//記事の内容を更新し、カテゴリー関連も更新
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } } // ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = params;

  // リクエストのbodyを取得
  const { title, content, categories, thumbnailUrl }: UpdatePostRequestBody =
    await request.json();

  try {
    // idを指定して、Postを更新
    //title, content, thumbnailUrlを更新
    //post.updateで記事本体の更新
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });

    // 一旦、記事と関連するカテゴリーの中間テーブルのレコードを全て削除
    //postCategory.deleteManyで中間テーブルのリセット
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    });

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成、再登録(多対多の再構築)
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施して登録してる
    //for...of＋postCategory.createで中間テーブルの再構築
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      });
    }

    // レスポンスを返す
    return NextResponse.json({ status: "OK", post: post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

//管理者　記事削除API
//DELETEという命名にすることで、DELETEリクエストの時にこの関数が呼ばれる
//指定IDの記事を削除
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    //postテーブルの該当IDのレコードを削除
    await prisma.post.delete({
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