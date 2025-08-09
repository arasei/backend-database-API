"use client";
import { useEffect, useState } from "react";
import { createPost } from "../new/page";//投稿API関数
//型だけインポート（実行時に消える）。カテゴリー配列と投稿payloadの型に使う。
import type { Category, CreatePost } from "@/app/_types/Post";


//記事のタイトル・本文・サムネイルURL・複数カテゴリーを入力して送信し、
// API経由で新規記事を作成する投稿フォームコンポーネント


const PostForm: React.FC = () => {
  //title,content,thumbnailUrlの状態を管理(初期値は空)
  const [title, setTitle] = useState("");//titleを管理
  const [content, setContent] = useState("")//本文を管理
  const [thumbnailUrl, setThumbnailUrl] = useState("");//サムネイルを管理
  const [categories, setCategories] = useState<Category[]>([]);//カテゴリー一覧を管理(配列)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);//選んだカテゴリー、選択状態を保持
  const [isSubmitting, setIsSubmitting] = useState(false); // 投稿中かどうか 送信中のフラグ。ボタン無効化等に使用

  //カテゴリー一覧をAPIから取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setCategories(data.categories as Category[]);//categories配列をセットする
      } catch (error) {
        console.error("カテゴリー取得エラー", error);
      }
    };
    fetchCategories();
  }, []);//依存配列が空なので初回のみ実行

  //フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    //フォームが送信された時に動く関数
    e.preventDefault();//フォーム送信時のリロードを防ぐ役割
    //カテゴリー未選択の場合の処理
    if (selectedCategories.length === 0) {
      alert("カテゴリーを選択してください。");
      return;
    }

    setIsSubmitting(true);

    try {
      //APIに渡すデータオブジェクトを作成
      const payload: CreatePost = {
        title,
        content,
        thumbnailUrl,
        //数字配列を [{id:number}] の配列に変換。API側の期待に合わせる。
        categories: selectedCategories.map((id) => ({ id })),
      };

      await createPost(payload);
      alert("投稿に成功しました");

      //フォームの内容をリセット(送信後に入力欄が空にする)
      setTitle("");
      setContent("");
      setThumbnailUrl("");
      setSelectedCategories([]);//複数の選択を初期化する
    } catch (error) {
      //エラーの場合
      console.error(error);//エラーの内容をコンソールに表示する
      alert("投稿に失敗しました。")
    } finally {
      //finallyで失敗しても実行
      setIsSubmitting(false);
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
        disabled={isSubmitting}
        className="border border-stone-300 rounded-lg p-3 w-full"
      />

      <label>内容</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        className="border border-stone-300 rounded-lg p-3 w-full"
      />

      <label>サムネイルURL</label>
        <input
          type="text"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          disabled={isSubmitting}
          className="border border-stone-300 rounded-lg p-3 w-full"
        />

      <label>カテゴリー</label>
      <select
        multiple//複数選択できるように
        //選択中の値(number[]→string[] に変換)
        value={selectedCategories.map(String)}
        //選択肢から配列を作り、Number(option.value) で数値配列に戻す。
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions,(option) => Number(option.value));
          setSelectedCategories(selected);
        }}
        disabled={isSubmitting}
        className="border border-stone-300 rounded-lg p-3 w-full"
      >
        {/*<option value=""></option>*/}
        {categories.map((category) => (
          //カテゴリー一覧データを元に選択肢を自動で作成
          <option key={category.id} value={category.id}>
            {category.name || "(名前なし)"}
            {/*category.nameがあればそれを表示、なければ"(名前なし)"を表示する*/}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`py-2 px-4 border block rounded-lg text-white text-white ${
          isSubmitting ? "bg-gray-400" : "bg-blue-700"
        }`}
      >
        {isSubmitting ? "投稿中..." : "作成"}
      </button>
    </form>
  );
};

export default PostForm;