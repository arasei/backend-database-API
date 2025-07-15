"use client";

import { CategoryForm } from "../../posts/_components/CategoryForm";

//新しいカテゴリーを作成する為のページを表示するコンポーネント。
//CategoryFormコンポーネントを表示することで、ユーザーがカテゴリーを追加できる画面を構成している。
const CreateCategories: React.FC = () => {
  return <CategoryForm/>;
};

export default CreateCategories;