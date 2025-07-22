"use client";

import { CategoryForm } from "../../posts/_components/CategoryForm";

//新しいカテゴリーを作成する為のページを表示するコンポーネント。
//CategoryFormコンポーネントを表示することで、ユーザーがカテゴリーを追加できる画面を構成している。
const CreateCategories: React.FC = () => {
  const handleSubmit = async (name: string) => {
    const res = await fetch("/api/admin/categories", {
      //第2引数はHTTPリクエストを送信する為の関数
      method: "POST",
      headers: { "Content-Type": "application/json" },//json形式で送る
      body: JSON.stringify({
        name,
      }),
    });
    if (res.ok) {
      alert("カテゴリーを作成しました。");
      //setName("");//フォームをリセット
    }else {
      alert("エラーが発生しました。");
    }
  };
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-lg font-bold mb-4">カテゴリー作成</h1>
      <CategoryForm onSubmit={handleSubmit} submitLabel="作成"/>
    </div>
  );
};

export default CreateCategories;