"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostForm } from "../_components/PostForm";
import { Post, CreatePost } from "@/app/_types/Post";


//全体の概要
//管理者が特定の記事の内容を取得し、フォームで編集・削除できるページを実装したコード

const EditPostPage = () => {
  const { id } = useParams();//URLから記事のIDを取得。動的ルートのパラメータを扱う
  const router = useRouter();//ページ遷移を制御するためのルーターオブジェクトを取得。

  //編集フォームに初期表示する記事データをstateで管理。初期値はnull（未取得状態）
  const [initialData, setInitialData] = useState<CreatePost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); //送信中状態を管理

  // 記事データとカテゴリ一覧を取得
  useEffect(() => {
    //非同期で記事データをAPIから取得する関数
    const fetchData = async () => {
      //記事IDをもとに記事詳細データをAPIから取得。
      const res = await fetch(`/api/admin/posts/${id}`);
      //APIレスポンスをJSONに変換し、postプロパティを含むことを型で示す。
      const data: { post: Post } = await res.json();
      //取得した記事情報を変数に格納。
      const post = data.post;

      //取得した記事の情報を、CreatePost型に合う形でセットし、フォームの初期値として登録。
      setInitialData({
        title: post.title,
        content: post.content,
        thumbnailUrl: post.thumbnailUrl,
        categories: post.postCategories.map((pc) => ({ id: pc.category.id })),
      });
    };

    fetchData();//先ほどのfetchData関数を実行
  }, [id]);//idが変わるたびにfetchDataを再実行

  // 更新処理（PUT）
  //編集フォームから送信された更新データを受け取り、APIにPUTリクエストを送る関数
  const handleUpdate = async (data: CreatePost) => {
    if (isSubmitting) return;//2重送信防止
    setIsSubmitting(true);    // 送信開始

    try {
      //編集内容をPUTリクエストでサーバーに送信。
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      //HTTPステータスが成功でなければエラーを投げる。
      if (!res.ok) throw new Error("更新失敗");
      //成功したらユーザーに通知
      alert("更新しました");
      //編集一覧ページへ遷移
      router.push("/admin/posts");
    } catch (error) {
      console.error(error);//エラー発生時の処理
      alert("更新に失敗しました");
    } finally {
      setIsSubmitting(false);//送信完了
    }
  };

  // 削除処理（DELETE）
  //記事削除処理用関数
  const handleDelete = async () => {
    //削除確認のダイアログ表示
    const ok = confirm("本当に削除しますか？");
    if (!ok) return;//ユーザーがキャンセルした場合中断
    if (isSubmitting) return; // 削除も連打防止
    setIsSubmitting(true); // 削除時もボタン無効化

    try {
      //DELETEメソッドで記事削除APIを呼ぶ。
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });
      //削除失敗時にエラーを投げる。
      if (!res.ok) throw new Error("削除失敗");
      //削除成功の通知。
      alert("削除しました");
      //削除後に記事一覧ページへ遷移。
      router.push("/admin/posts");
    } catch (error) {
      console.error(error);//エラー表示とユーザー通知。
      alert("削除に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  //データ取得中はローディング表示。
  if (!initialData) {
    return <p>読み込み中...</p>;
  }

  //初期データと操作関数を渡してフォームをレンダリング。
  return (
    <PostForm
      initialData={initialData} // 記事の初期データ
      onSubmit={handleUpdate}    // 更新処理
      onDelete={handleDelete}    // 削除処理
      submitLabel={isSubmitting ? "更新中..." : "更新"} //ボタンラベル切り替え
      isSubmitting={isSubmitting}//送信中状態渡す
    />
  );
};

export default EditPostPage;
