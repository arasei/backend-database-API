"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";

//全体の概要
//このコードは、特定のカテゴリーの情報をAPIから取得し、
//管理者がそのカテゴリー名を編集・削除できる機能を提供するNext.jsのクライアントコンポーネントです。


//カテゴリー編集(更新、削除)ページ
const EditCategoryPage: React.FC = () => {
  const params = useParams();
  //useParams() は string | undefined を返す可能性があるため、明示的なキャスト(as構文　例:as string)を記述
  //ルートのIDを取得(例:/admin/categories/3の「3」を取得)(カテゴリーIDを取得、idはAPIへのリクエストに使用)
  const  id  = useParams().id as string;
  const router = useRouter();//ページ遷移を制御する為のフック。更新・削除後に/admin/categoriesへリダイレクトするのに使用。
  const [name, setName] = useState("");//初期値は空

  //カテゴリー名をAPIから取得(初回のみ)
  useEffect(() => {
    if (!id) return;//idがundefinedの場合、処理を中止
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        const data = await res.json();
        setName(data.category.name);
      } catch (error) {
        console.error("カテゴリー取得エラー:",error);
        alert("カテゴリー情報の取得に失敗しました");
      }
    };
    fetchCategory();
  },[id]);

  //編集処理(PUT)
  //フォーム送信時にPUTリクエストを送り、成功すれば一覧画面へ遷移。
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();//ページリロード防止
    //バリデーションを追加（name.trim() が空でも送信できてしまうのを防ぐため）。
    if(!name.trim()) {
      alert("カテゴリー名を入力してください");
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${id}`,{
        method: "PUT",
      headers: {"Content-Type": "application/json"},//json形式で送る
      body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        alert("カテゴリーを更新しました");
        router.push("/admin/categories");//指定したURL(ここではカテゴリー一覧)に画面遷移する為の関数
      } else {
        alert("更新に失敗しました。");
      }
    } catch (error) {
      console.error("更新処理エラー:",error);
      alert("通信エラーが発生しました");
    }
  };

  //削除処理(DELETE)
  const handleDelete = async () => {
    const ok = confirm("本当に削除してもよろしいですか？");//ユーザーに確認ポップアップを出す
    if (!ok) return;//okでない場合(キャンセルされたら=falseされたら)その時点で関数の処理を終了する(何もしない)
    try {
      const res = await fetch(`/api/admin/categories/${id}`,{
        method: "DELETE",
      });
      
      //カテゴリー削除に成功時にはカテゴリー一覧画面に移動
      if(res.ok) {
        alert("カテゴリーを削除しました");
        router.push("/admin/categories");//新しいURLを履歴に追加してページ遷移する(前のページに戻れる)
      } else {
        alert("削除に失敗しました");
      }
      //エラーハンドリングとして例外処理(try-catch)を実施
    } catch (error) {
      console.error("削除処理エラー:",error);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4 p-4">
      <h1 className="text-lg font-bold mb-4">
        カテゴリー編集
      </h1>
      <label htmlFor="name">カテゴリー名</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
      ></input>
      <div>
        <button
          type="submit"
          className="py-2 px-4 border block rounded-lg text-white bg-blue-700"
        >
          更新
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="py-2 px-4 border block rounded-lg text-white bg-red-600"
        >
          削除
        </button>
      </div>
    </form>
  );
};

export default EditCategoryPage;