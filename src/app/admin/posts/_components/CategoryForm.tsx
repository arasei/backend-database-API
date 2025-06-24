"use client";

import { useState } from "react";

//カテゴリー新規作成フォームコンポーネント
//カテゴリー名(name)を入力し、POSTリクエストで/api/admin/categoriesに送信
export const CategoryForm = () => {
  const [name, setName] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    //フォームが送信された時に動く関数
    e.preventDefault(); //フォーム送信時のリロードを防ぐ役割
    const res = await fetch("/api/admin/categories", {
      // 第2引数はHTTPリクエストを送信するための関数
      method: "POST",
      headers: { "Content-Type": "application/json" }, //json形式で送る
      body: JSON.stringify({
        name,
      }),
    });

    if (res.ok) {
      alert("カテゴリーを作成しました。");
      setName(""); //フォームリセット
    } else {
      alert("エラーが発生しました。");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h1 className="text-lg font-bold mb-9 mt-2">カテゴリー作成</h1>
      <label>カテゴリー名</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
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