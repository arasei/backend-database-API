"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


//全体の概要
//管理画面で特定の記事の内容と関連カテゴリーを編集・削除できるページを実装
//フォームから記事情報を取得・更新・削除し、複数のカテゴリーをチェックボックスで選択可能にしています。

//カテゴリーデータの型定義（IDと名前）。
type Category = {
  id: number;
  name: string;
};

//記事データの型。postCategoriesは中間テーブル形式でカテゴリーを含む。
type Post = {
  title: string;
  content: string;
  thumbnailUrl: string;
  postCategories: {
    category: Category;
  }[];
};

//記事編集(更新、削除)ページ
const EditPostPage = () => {
  //URLから記事IDを取得し、ルーターで画面遷移を制御。
  const { id } = useParams();
  const router = useRouter();
  
  //各フォーム項目と、選択されたカテゴリID・全カテゴリ一覧のstateを初期化。
  const [title, setTitle] = useState("");//titleを管理
  const [content, setContent] = useState("");//本文を管理
  const [thumbnailUrl, setThumbnailUrl] = useState("");//サムネイルを管理
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);//カテゴリーIDだけを保持
  const [allCategories, setAllCategories] = useState<Category[]>([]);//カテゴリー一覧全部の情報を保持する役割（UI上にボタン表示するための用途）

  //初回レンダリング時にuseEffect内を実行(初期データ取得)
  useEffect(() => {
    if (!id) return;//idが存在しない場合は処理を中断（URLにIDがないときの安全策）
    //記事の詳細をAPIから取得して、フォームに初期値として反映。
    const fetchData = async () => {
      try {
        //複数の非同期リクエストを同時に実行（記事とカテゴリー一覧）。
        const [postRes, categoryRes] = await Promise.all([
          fetch(`/api/admin/posts/${id}`),
          fetch(`/api/admin/categories`)
        ]);
        const postData = await postRes.json();
        const categoryData = await categoryRes.json();

        const post: Post = postData.post;
        //記事情報とカテゴリ一覧をステートにセット。
        setTitle(post.title);
        setContent(post.content);
        setThumbnailUrl(post.thumbnailUrl);
        //postCategories.map(...)で、関連付けられたカテゴリのIDのみ抽出して選択状態に反映(選択済みリストに)。
        setSelectedCategories(post.postCategories.map((pc) => pc.category.id));
        setAllCategories(categoryData.categories);
      } catch (error) {
        console.error("データ取得エラー", error);
      }
    };

    fetchData();
  }, [id]);//エラー時のログ出力と、id変更時に再取得するようにしています。

  //編集処理(PUT)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();//フォーム送信時のページリロードを防ぐ。

    //APIに記事情報を送信。
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl,
        categories: selectedCategories.map((id) => ({ id }))//categoriesは{ id: number }の形式で送信(APIに合わせてオブジェクト形式に)
      })
    });

    if (res.ok) {
      alert("更新しました。");
      router.push("/admin/posts");
    } else {
      alert("更新に失敗しました。");
    }
  };


  //削除処理（DELETE）
  const handleDelete = async () => {
    const ok = confirm("本当に削除しますか？");//ユーザーに削除確認ポップアップを出す
    if (!ok) return;//OKじゃなかったら（キャンセルされたら＝falseされたら）そこで関数の処理を終了する（何もしない）

    //記事を削除するリクエスト送信。
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("削除しました。");
      router.push("/admin/posts");//削除後、新しいURLを履歴に追加してページ遷移する(前のページに戻れる)
    } else {
      alert("削除に失敗しました。");
    }
  };
  
  //カテゴリー選択のトグル関数
  //チェックボックスをクリックしたとき、選択状態をトグル（ON/OFF）します。
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    //フォーム送信でhandleSubmitが呼ばれる。
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h1 className="text-lg font-bold mb-4">記事編集</h1>

      <label>タイトル</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
      />

      <label>内容</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
      />

      <label>サムネイルURL</label>
      <input
        type="text"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
      />
      
      {/*チェックボックスで複数カテゴリーを選択可能。*/}
      {/*toggleCategoryで選択状態を更新。*/}
      <label>カテゴリー（複数選択可）</label>
      <div className="space-y-2">
        {allCategories.map((category) => (
          <label key={category.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
            />
            <span>{category.name || "(名前なし)"}</span>{/* category.nameがあればそれを表示、なければ"(名前なし)"を表示 */}
          </label>
        ))}
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="py-2 px-4 rounded-lg text-white bg-blue-700"
        >
          更新
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="py-2 px-4 rounded-lg text-white bg-red-600"
        >
          削除
        </button>
      </div>
    </form>
  );
};

export default EditPostPage;
