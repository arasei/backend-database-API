import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()


//全体の概要
//管理者用のカテゴリーAPI
// 管理画面で使うカテゴリー一覧の取得（GET）と新規作成（POST）を処理するAPI

//管理者　カテゴリー一覧取得API
export const GET = async (request: NextRequest) => {
  try {
    // カテゴリーの一覧をDBから取得
    //PrismaORMを使ってcategoryテーブルのデータを全件取得。
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc', // 作成日時の降順で取得
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// カテゴリー作成のリクエストボディの型を指定
// カテゴリーの作成時に送られてくるリクエストのbodyの型
interface CreateCategoryRequestBody {
  name: string
}

//管理者　カテゴリー新規作成API
export const POST = async (request: Request, context: any) => {
  try {
    //フロントエンドから送られてくるリクエストのbody(name)をJSONとして取得
    const body = await request.json()

    // bodyの中からnameを取り出す
    const { name }: CreateCategoryRequestBody = body

    //Prismaのcreate()メソッドで新しいカテゴリーをデータベースに追加。
    const data = await prisma.category.create({
      data: {
        name,
      },
    })

    //作成されたカテゴリーのidを含むJSONレスポンスを返す
    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}


//改善点・補足
//問題・懸念	改善案・補足内容
//PrismaClient を毎回生成	lib/prisma.ts 等でグローバルに使い回すとベター（開発時の接続数オーバー対策）
//POST のバリデーションがない	空文字や長さ制限のチェックを zod や Yup で行うと安全
//context 未使用	不要なら削除してOK（POST = async (request) で十分）