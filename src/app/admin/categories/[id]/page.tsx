"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

//カテゴリー編集(更新、削除)ページ
const EditCategoryPage = () => {
  const { id } = useParams();//ルートのIDを取得(カテゴリーIDを取得、idはAPIへのリクエストに使用)
  const router = useRouter();
  const [name, setName] = useState("");//初期値は空

  //カテゴリー名をAPIから取得(初回のみ)
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await fetch(`/api/admin/categories/${id}`);
      const data = await res.json();
      setName(data.category.name);
    };
    fetchCategory();
  }, [id]);

  //編集処理(PUT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();//ページリロード防止
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},//json形式で送る
      body: JSON.stringify({ name }),
    });
    //カテゴリー更新に成功時には、カテゴリー一覧画面に移動
    if (res.ok) {
      alert("カテゴリーを更新しました");
      router.push("/admin/categories");//指定したURL(ここではカテゴリー一覧)に画面遷移する為の関数
    } else {
      alert("更新に失敗しました。");
    }
  };
  //削除処理(DELETE)
  const handleDelete = async () => {
    const ok = confirm("本当に削除してもよろしいですか？");//ユーザーに確認ポップアップを出す
    if (!ok) return;//okでない場合(キャンセルされたら=falseされたら)その時点で関数の処理を終了する(何もしない)
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
    //カテゴリー削除に成功時にはカテゴリー一覧画面に移動
    if (res.ok) {
      alert("カテゴリーを削除しました。");
      router.push("/admin/categories");//新しいURLを履歴に追加してページ遷移する(前のページに戻れる)
    } else {
      alert("削除に失敗しました。");
    }
  };
  return (
    <form onSubmit={handleUpdate} className="space-y-4 p-4">
      <h1 className="text-lg font-bold mb-4">
        カテゴリー編集
      </h1>
      <label>カテゴリー名</label>
      <input
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