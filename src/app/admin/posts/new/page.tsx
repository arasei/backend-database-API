"use client"

import { CreatePost } from "@/app/_types/Post";
import PostForm from "../_components/PostForm";

//管理者用の記事投稿ページ
//全体の概要
//管理者用の記事作成ページで、フォーム入力内容（タイトル・本文・サムネイルURL・カテゴリー）をAPI経由で送信し、Prisma ORMを使って記事データをデータベースに保存する処理

// 管理者_記事の新規作成リクエスト。データをバックエンドのAPIに送信するための関数。役割→「投稿すること」だけ
export const createPost = async (postData: CreatePost) => {
  try {
    const { title, content, thumbnailUrl, categories } = postData; //postdataから必要なデータを分割代入で取得
    //投稿API(バックエンド)にHTTP POSTリクエストを送信
    //エンドポイント/api/admin/postsは記事作成API。
    const res = await fetch("/api/admin/posts", {
      // 第2引数はHTTPリクエストを送信するための関数
      //POSTメソッドを指定し、ヘッダーに "Content-Type": "application/json" を表示。
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, thumbnailUrl, categories }), //必要なデータだけ送る
    });
    if (!res.ok) {
      throw new Error("投稿に失敗しました");
    } //リクエストが失敗した場合
    //APIから返された投稿データをCreatePost型で受け取り返却。
    const data: CreatePost = await res.json(); //レスポンスの JSON を JavaScript オブジェクトに変換
    return data; //作成されたデータを返す
  } catch (error) {
    console.error("投稿エラー",error); 
  }
};

// // NewPostPage関数でPostFormコンポーネントだけを返す
const NewPostPage = () => {
  return <PostForm />;
};

export default NewPostPage;