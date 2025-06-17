//サーバーから取得する時に使用(取得用)
export type Post = {
  id: number;
  title: string;
  content: string;
  thumbnaiUrl: string;
  createdAt: string;
  updateAt: string;
  categories: { id: number; name: string;}[];
};

//新規投稿で使うときに使用(送信用)
export type NewPost = {
  title: string;
  content: string;
  thumbnaiUrl: string;
  categories: {id: number}[];
}