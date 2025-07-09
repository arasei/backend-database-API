
//全体の概要
//投稿データを扱うために、サーバーから取得する用(Post型)と新規投稿時に送信する用(CreatePost型)の2つの型定義を行っている。

//サーバーからとってくるとき（取得用）
export type Post = {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  categories: { id: number; name: string }[];
};

//新規投稿で使うとき（送信用）
export type CreatePost = {
  title: string;
  content: string;
  thumbnailUrl: string;
  categories: { id: number }[];
};