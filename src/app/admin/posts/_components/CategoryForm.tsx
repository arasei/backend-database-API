"use client";

import { useEffect, useState } from "react";

//全体の概要
//カテゴリーの新規作成や編集に使える共通フォームコンポーネントで、ユーザーが入力したカテゴリー名を送信し、必要に応じて削除ボタンも表示・実行できる。


//このコンポーネントが受け取る値(props)の型定義
type Props = {
  onSubmit: (name: string) => void; //フォームの送信時に呼ばれる関数(何も返さない、親コンポーネントで処理)
  onDelete?: () => void; //削除ボタンによる削除処理。任意(何も返さない、編集ページでのみ使う)
  defaultValue?: string; //編集時などに初期表示するカテゴリー名。初期の入力値（空文字や既存のカテゴリー名)
  submitLabel: string; //ボタンに表示するテキスト(作成、更新など)
};

//カテゴリー新規作成、編集　共通コンポーネント
export const CategoryForm: React.FC<Props> = ({
  onSubmit,
  onDelete,
  defaultValue = "", //propsがなかった時(defaultValueが未指定のとき)に空文字を使うため = ""とする。
  submitLabel,
}) => {
  const [name, setName] = useState(defaultValue); //カテゴリー名の入力欄の値を保持
  useEffect(() => {
    setName(defaultValue); //defaultValueが変更された時に入力欄の中身も更新(編集ページから新しいカテゴリーが読み込まれたとき用)
  }, [defaultValue]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("カテゴリー名を入力してください");
      return;
    }
    onSubmit(name.trim());
  };

  return (
    //フォーム送信時にhandleSubmitが呼ぶ。
    <form onSubmit={handleSubmit} >
      {/*ラベルとテキスト入力欄を表示*/}
      {/*入力のたびにnameを更新*/}
      <label>カテゴリー名</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full mb-4"
      ></input>
      {/*submitLabelに応じて表示内容(作成・更新)を切り替え*/}
      <div className="flex gap-4">
        <button
          type="submit"
          className="py-2 px-4 border block rounded-lg  text-white bg-blue-700"
        >
          {submitLabel}
        </button>
        {/* onDeleteが渡された時だけ削除ボタンを表示するように(個別編集ページ用) */}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="py-2 px-4 border block rounded-lg  text-white bg-red-600"
          >削除</button>
        )}
      </div>
    </form>
  );
};