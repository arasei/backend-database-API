"use client";

import { useEffect, useState } from "react";
import { CreatePost, Category } from "@/app/_types/Post";

//全体の概要
//記事タイトル・本文・サムネイルURL・カテゴリ選択を行うフォームを提供し、
//新規作成や編集ページで再利用できるように、初期データや送信処理・削除処理を柔軟に外部から受け取れる設計

//PostFormが受け取るpropsの型定義
export type PostFormProps = {
  initialData: CreatePost;//フォームの初期値(新規作成・編集共通)。
  onSubmit: (data: CreatePost) => void;//送信時の処理関数
  onDelete?: () => void;//削除ボタン押下時の関数(省略可)
  submitLabel: string;//ボタンのラベル文字列
  isSubmitting?: boolean;
};

//PostFormコンポーネント本体。propsを分割代入で受け取る。
export const PostForm: React.FC<PostFormProps> = ({
  initialData,
  onSubmit,
  onDelete,
  submitLabel,
  isSubmitting = false, //  デフォルトはfalseの状態
}) => {
  //各フォームフィールドのstateを初期データからセット。
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnailUrl);
  //選択されたカテゴリーIDを保持。
  //初期データからidだけを抽出してstateに格納
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialData.categories.map((c) => c.id)
  );
  //全カテゴリー一覧を保持するstate
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // カテゴリー一覧をAPIから取得（初回のみ）
  //初回レンダリング時にカテゴリー一覧をAPIから取得しstateにセット。
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setAllCategories(data.categories);
      } catch (error) {
        console.error("カテゴリー取得エラー", error);
      }
    };
    fetchCategories();
  }, []);//空配列[]を渡しているのでマウント時1回だけ実行

  //フォーム送信時に実行される関数。
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      //カテゴリー未選択ならalertでエラー。
      alert("カテゴリーを選択してください。");
      return;
    }
    //正常時はonSubmit関数を呼び出してデータを親に渡す。
    onSubmit({
      title,
      content,
      thumbnailUrl,
      categories: selectedCategories.map((id) => ({ id }))
    });
  };

  //カテゴリー選択のトグル処理(選択/解除)を実現している。
  //チェックボックスのON/OFF操作時に選択IDをトグルする関数。
  //categoryId(選択or解除したいカテゴリーID)を引数で受け取る関数。
  const toggleCategory = (categoryId: number) => {
    //stateの更新関数setSelectedCategoriesを利用。
    //関数型アップデートを使って、直前の状態prevを取得し更新処理を行う。
    setSelectedCategories((prev) =>
      //現在の選択状態(prev配列)に、今回クリックしたcategoryIdが含まれているかを判定。
      prev.includes(categoryId)
        //もし既に選択されていたら(=チェックされていたら)、そのIDを配列から除外(削除)する。選択解除動作。
        ? prev.filter((id) => id !== categoryId)
        //もし未選択だった場合(=チェックされていなかったら)、categoryIdを配列の末尾に追加し、新しい配列を返す。
        //選択追加動作
        : [...prev, categoryId]
    );
  };

  return (
    //フォーム全体の開始タグ。送信時にhandleSubmitが呼ばれる。
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h1 className="text-lg font-bold mb-4">記事フォーム</h1>

      {/*以下フォーム項目は共通パターンです*/}
      {/*ラベルと入力欄*/}
      {/*入力値変更時にstateが更新される*/}
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

      {/*カテゴリー選択欄。取得したallCategoriesを順番に表示*/}
      {/*選択状態はselectedCategoriesに基づく。*/}
      {/*チェック時にトグル関数が呼ばれる*/}
      <label>カテゴリー（複数選択可）</label>
      <div className="space-y-2">
        {allCategories.map((category) => (
          <label key={category.id} className="flex items-center space-x-2">
            <input
              type="checkbox"//チェックボックスであることを指定。
              //現在そのカテゴリーが選択されているかをselectedCategoriesから判定し、状態を反映。
              checked={selectedCategories.includes(category.id)}
              //チェック/アンチェック時に呼び出される関数。ここでは toggleCategory で選択状態をトグル。
              onChange={() => toggleCategory(category.id)}
            />
            <span>{category.name || "(名前なし)"}</span>
          </label>
        ))}
      </div>

      {/*送信ボタン部分。submitLabelによって作成/更新の文言が切り替わる。*/}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}//ここでdisabled適用
          className={`py-2 px-4 rounded-lg text-white ${isSubmitting ? "bg-gray-400" : "bg-blue-700"}`}
        >
          {submitLabel}
        </button>

        {/*onDeleteが渡されている時だけ削除ボタンを表示。*/}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="py-2 px-4 rounded-lg text-white bg-red-600"
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
};
