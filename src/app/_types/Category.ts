//カテゴリーの型指定
//取得用(既存データ)と送信用(新規作成)で使い分けるためそれぞれを指定

//APIなどから取得した既存カテゴリーのデータ(ID付き)を表す型
//データ取得時(GET)や画面表示時に使用する
//取得用
export type Category = {
  id: number;
  name: string;
};

//新しいカテゴリーを新規作成し、追加するための型(nameのみ)
//フォーム入力などからAPI送信(POST)時に使用
//送信用
export type createCategory = {
  name: string;
};