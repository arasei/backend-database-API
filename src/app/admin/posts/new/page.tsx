"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostForm } from "../_components/PostForm";//共通フォームコンポーネントをインポート。新規作成・編集で再利用。
import { CreatePost } from "@/app/_types/Post";//投稿データの型定義(CreatePost)をインポート。型安全にデータを扱うため。

//管理者が新規記事を作成するページで、フォーム入力内容をAPI経由で送信し、
//投稿完了後に記事一覧ページへ遷移するコンポーネント

const NewPostPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);//送信中状態を管理

  // 新規作成時の送信処理
  //投稿データ送信処理(POSTリクエスト)関数。
  //PostFormから渡ってくるデータを受け取る。
  const handleCreate = async (data: CreatePost) => {
    if (isSubmitting) return; //2重送信防止

    setIsSubmitting(true);//送信開始→ボタンdisabledにする。

    try {
      //APIエンドポイントにPOSTリクエスト送信。
      // 投稿データをバックエンドに送る。
      const res = await fetch("/api/admin/posts", {
        //POSTメソッドでJSON形式のデータ送信を指定。
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("投稿に失敗しました");

      alert("投稿が完了しました");
      //投稿完了後に記事一覧ページへリダイレクト。
      router.push("/admin/posts");
    } catch (error) {
      console.error(error);
      alert("投稿に失敗しました");
    } finally {
      setIsSubmitting(false);//送信完了→ボタン復活
    }
  };

  // 新規作成時の初期データ
  //フォームに渡す初期データを宣言。全て空状態で新規作成用
  const initialData: CreatePost = {
    title: "",
    content: "",
    thumbnailUrl: "",
    categories: [], // カテゴリーは空配列
  };

  //再利用可能なPostFormコンポーネントを呼び出し、
  // 必要なプロパティ（初期データ・送信処理・ボタンラベル）を渡す。
  return (
    <PostForm
      initialData={initialData}  // 空の初期データを渡す
      onSubmit={handleCreate}     // 作成処理を渡す
      //ボタンのラベル
      submitLabel={isSubmitting ? "投稿中.." : "作成"}   // ボタンのラベルを変える
      isSubmitting={isSubmitting}//送信中状態を渡す。
    />
  );
};

export default NewPostPage;
