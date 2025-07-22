"use client";

import { useState } from "react";

//全体の概要
//新しいカテゴリーを作成するためのReactコンポーネント。
//ユーザーがカテゴリーを入力して送信すると、その情報がAPI(/api/admin/categories)にPOSTリクエストで送られ、サーバー側で新規カテゴリーを作成し登録する。


//カテゴリー新規作成フォームコンポーネント
//カテゴリー名(name)を入力し、POSTリクエストで/api/admin/categoriesに送信
export const CategoryForm: React.FC = () => {
  const [name, setName] = useState("");//ユーザーが入力したカテゴリー名を保存(初期値は空文字)(setNameで入力されたカテゴリー名を更新をする)
  const handleSubmit = async (e: React.FormEvent) => {
    //フォームが送信された時に動く関数
    e.preventDefault(); //フォーム送信時のリロードを防ぐ役割
    const res = await fetch("/api/admin/categories", {
      // /api/admin/categoriesエンドポイントへPOSTリクエストを送る。
      // 第2引数はHTTPリクエストを送信するための関数
      method: "POST",
      headers: { "Content-Type": "application/json" }, //json形式で送る
      body: JSON.stringify({ name }),//送信内容はカテゴリー名１つのみ。(例:{ name:"React"})
    });

    if (res.ok) {
      alert("カテゴリーを作成しました。");
      setName(""); //フォームリセット
    } else {
      alert("エラーが発生しました。");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">{/*handleSubmitを送信時に実行*/}
      <h1 className="text-lg font-bold mb-9 mt-2">カテゴリー作成</h1>
      <label>カテゴリー名</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}//入力が変化するたびにnameの状態を更新。
        className="border border-stone-300 rounded-lg p-3 w-full"
      ></input>
      <button
        type="submit"
        className="py-2 px-4 border block rounded-lg  text-white bg-blue-700"
      >
        作成
      </button>
    </form>
  );
};