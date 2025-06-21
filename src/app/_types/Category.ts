//カテゴリーの型指定

//APIなどから取得した既存カテゴリーのデータ(ID付き)に使用する
//取得用
export type Category = {
  id: number;
  name: string;
};
//新しいカテゴリーを追加する時に使用する(新規作成)
//送信用
export type createCategory = {
  name: string;
};