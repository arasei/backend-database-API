"use client";
import { useEffect, useState } from "react";
import { NewPost } from "../new/page";

type Category = {
  id: number;
  name: string;
};

const PostForm: React.FC = () => {
  //title,content,thumbnailUrlの状態を管理(初期値は空)
  const [title, setTitle] = useState<string>("");//titleを管理
  const [content, setContent] = useState<string>("")//本文を管理
  const [thumbnailUrl, setThumbnailUrl] = useState("");//サムネイルを管理
  const [categories, setCategories] = useState("");//カテゴリー一覧を管理(配列)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);//選んだカテゴリー、選択状態を保持

  //カテゴリー一覧をAPIから取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setCategories(data.categories);//categories配列をセットする
      } catch (error) {
        console.error("カテゴリー取得エラー", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    //フォームが送信された時に動く関数
    e.preventDefault();//フォーム送信時のリロードを防ぐ役割
    try {
      if (setSelectedCategories.length === 0) {
        alert("カテゴリーを選択してください。");
        return;
      }
      await NewPost({
        title,
        content,
        thumbnailUrl,
        categories: selectedCategories.map((id) => ({ id })),//複数対応
      });
      alert("投稿に成功しました");

      //フォームの内容をリセット(送信後に入力欄が空になる)
      setTitle("");
      setContent("");
      setThumbnailUrl("");
      setSelectedCategories([]);//複数の選択を初期化する
    } catch (error) {
      //エラーの場合
      console.log(error);//エラーの内容をコンソールに表示する
      alert("投稿に失敗しました。");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h1 className="text-lg font-bold mb-9 mt-2">記事編集</h1>
      <label>タイトル</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full">
      </input>
      <label>内容</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full">
      </textarea>
      <label>サムネイルURL</label>
        <input
          type="text"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className="border border-stone-300 rounded-lg p-3 w-full">
        </input>
      <label>カテゴリー</label>
      <select
        multiple//複数選択できるように
        value={selectedCategories.map(String)}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions,(option) => Number(option.value));
          setSelectedCategories(selected);
        }}
        className="border border-stone-300 rounded-lg p-3 w-full"
      >
        {/*<option value=""></option>*/}
        {categories.map((category) => {
          //カテゴリー一覧データを元に選択肢を自動で作成
          return (
            <option key={category.id} value={category.id}>
              {category.name || "(名前なし)"}{" "}
              {/*category.nameがあればそれを表示、なければ"(名前なし)"を表示する*/}
            </option>
          );
        })}
      </select>
      <button
        type="submit"
        className="py-2 px-4 border block rounded-lg text-white bg-blue-700">
        作成
      </button>
    </form>
  );
};

export default PostForm;