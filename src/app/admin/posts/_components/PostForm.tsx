"use client";

import { useEffect, useState } from "react";
import { createPost } from "../new/page";

// 全体の概要
// 記事投稿フォームを提供するReactコンポーネントで、入力されたデータ（タイトル・本文・サムネイルURL・カテゴリー）をAPI経由でサーバーに送信して、新規記事を作成する。カテゴリー一覧は初回レンダリング時にAPIから取得してセレクトボックスに表示する。

//APIから取得するデータの型定義
type Category = {
  id: number;
  name: string;
};

const PostForm: React.FC = () => {
  //title,content,thumbnailUrl,の状態を管理(初期値は空)
  const [ title,setTitle ] = useState<string>("");//titleを管理
  const [ content,setContent ] = useState<string>("");//本文を管理
  const [ thumbnailUrl,setThumbnailUrl ] = useState("");//サムネイルを管理
  const [ categories,setCategories ] = useState<Category[]>([]);//カテゴリー一覧を(配列)で管理
  const [ selectedCategory,setSelectedCategory ] = useState<number | null>(null)//選んだカテゴリー
  //カテゴリー一覧をAPIから取得(初回レンダリング時のみ実行)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");//セレクトボックスに表示するため
        const data = await res.json();
        setCategories(data.categories);//categories配列をセットする
      } catch (error) {
        console.log("カテゴリー取得エラー",error);
      }
    };
    //空の依存配列にし、初回レンダリング時のみ実行
    fetchCategories();
  },[]);

  const handleSubmit = async (e: React.FormEvent) => {
    //フォーム送信時に動く関数
    e.preventDefault();//フォーム送信時のリロードを防ぐ役割
    try {
      if (selectedCategory === null) {
        alert("カテゴリーを選択してください。");
        return;
      }
      //createPost関数で投稿データをサーバーに送信。
      await createPost({
        title,
        content,
        thumbnailUrl,
        categories: [{ id: selectedCategory }],//投稿する時は配列で渡す
      });
      alert("投稿に成功しました。");

      //フォームの内容をリセット(送信後に入力欄が空になる)
      setTitle("");
      setContent("");
      setThumbnailUrl("");
      setSelectedCategory(null);
    } catch (error) {
      //エラーの場合
      console.log(error);//エラーの内容をコンソールに表示
      alert("投稿に失敗しました。");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h1 className="text-lg font-bold mb-9 mt-2">
        記事編集
      </h1>
      <label>タイトル</label>
      <input
        type="text"
        {/*valueに状態titleをバインドし入力が変更されるとsetTitleが呼ばれる*/}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
      ></input>

      <label>内容</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
      ></textarea>

      <label>サムネイルURL</label>
      <input
        type="text"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
      ></input>

      <label>カテゴリー</label>
      <select
        value={selectedCategory !== null ? String(selectedCategory) : ""}//選択中のカテゴリーIDをセット(String配列として)
        //selectの選択が変わるとonChange関数を呼び出す
        onChange={(e) => {
          setSelectedCategory(Number(e.target.value));
        }}
        className="border border-stone-300 rounded-lg p-3 w-full"
      >
        <option value=""></option>
        {/*<option value=""></option>*/}
        {/*最初は空白の選択肢。選択解除用*/}
        {/*空の選択肢を１つ入れることで「未選択の状態」や「選択解除」を可能にする*/}

        
        {categories.map((category) => {
          //カテゴリー一覧データを元にcategoriesをループして<option>を自動で作成
          return(
            <option key={category.id} value={category.id}>
              {category.name || "(名義なし)"}{""}
              {/*category.nameがあればそれを表示、なければ"(名前なし)"を表示*/}
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