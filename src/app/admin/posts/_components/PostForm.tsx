"use client";

import { useEffect, useState } from "react";
import { CreatePost, Category } from "@/app/_types/Post";

//全体の概要
//記事のタイトル・本文・サムネイルURL・カテゴリーを入力でき、
//送信中は全ての入力やボタンを操作不能にする投稿フォームコンポーネント

//PostFormが受け取るpropsの型定義
export type PostFormProps = {
  initialData: CreatePost;//フォームの初期値(新規作成・編集共通)。
  //送信時の処理関数
  //onSubmitがPromise<void>を返す型(非同期送信処理を想定)
  onSubmit: (data: CreatePost) => Promise<void>;
  onDelete?: () => void;//削除ボタン押下時の関数(省略可)
  submitLabel: string;//ボタンのラベル文字列
  isSubmitting?: boolean;
  disabled?: boolean;
};

//PostFormコンポーネント本体。propsを分割代入で受け取る。
export const PostForm: React.FC<PostFormProps> = ({
  initialData,
  onSubmit,
  onDelete,
  submitLabel,
}) => {
  //入力値と状態管理
  //各フォームフィールドのstateを初期データ(initialData)からセット。
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnailUrl);
  //選択されたカテゴリーIDを保持。
  //初期データからidだけを抽出してstate(配列)に保持
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialData.categories.map((c) => c.id)
  );
  //全カテゴリー一覧を保持するstate
  //APIから取得したカテゴリー一覧を格納
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  //投稿中フラグ。これがtrueになると全UIがdisabledになる。
  const [isSubmitting, setIsSubmitting] = useState(false);//投稿中かどうか

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


  //handleChangeCategoryは<select multiple>の選択が変わった時に呼ばれる
  //複数選択の<select>から選択されたoptionのvalueを数値配列として取得
  const handleChangeCategory = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = e.target.selectedOptions;
    if (!selectedOptions) {
      setSelectedCategories([]);
      return;
    }
    //target.selectedOptions は、ユーザーが選択した <option> 要素のリスト。
    //Array.from でこの selectedOptions を配列に変換し、option.value を Number に変換して数値の配列にします。
    //選ばれたカテゴリーIDの数値配列を作っている。
    const selected: number[] = Array.from(e.target.selectedOptions, (option) => Number(option.value));
    setSelectedCategories(selected);//選択状態のカテゴリーIDをReactのstateに保存
  };

  //フォーム送信時に実行される関数。
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      //カテゴリー未選択ならalertでエラー。
      alert("カテゴリーを選択してください。");
      return;
    }
    //isSubmittingをtrueにしてUIをロック。
    setIsSubmitting(true);//投稿中に切り替え
    try {
      //onSubmitはpropsで渡された非同期関数を実行。
      await onSubmit({
        title,
        content,
        thumbnailUrl,
        categories: selectedCategories.map((id) => ({ id }))
      });
    } finally {
      setIsSubmitting(false);//投稿終了後に解除
    }
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
        disabled={isSubmitting}
      />

      <label>内容</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
        disabled={isSubmitting}
      />

      <label>サムネイルURL</label>
      <input
        type="text"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
        disabled={isSubmitting}
      />

      {/*カテゴリー選択欄。取得したallCategoriesを順番に表示*/}
      {/*選択状態はselectedCategoriesに基づく。*/}
      {/*チェック時にトグル関数が呼ばれる*/}
      <label>カテゴリー（複数選択可）</label>
      <select
        multiple
        value={selectedCategories.map(String)} //valueはstring[]で渡す。
        onChange={handleChangeCategory}
        className="border border-stone-300 rounded-lg p-3 w-full"
        disabled={isSubmitting}//投稿中は選択できない
      >
        {allCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name || "(名前なし)"}
          </option>
        ))}
      </select>

      {/*送信ボタン部分。submitLabelによって作成/更新の文言が切り替わる。*/}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="py-2 px-4 rounded-lg text-white bg-blue-700"
          disabled={isSubmitting}//投稿中は押せない
        >
          {isSubmitting ? "送信中..." : submitLabel}
        </button>

        {/*onDeleteが渡されている時だけ削除ボタンを表示。*/}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="py-2 px-4 rounded-lg text-white bg-red-600"
            disabled={isSubmitting}//投稿中は削除もできない
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
};
