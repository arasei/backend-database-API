// カテゴリー型
export interface Category {
  id: number;
  name: string;
}

// 共通ベース型（新規・更新の両方で使う）
export interface BasePostPayload {
  title: string;
  content: string;
  thumbnailUrl: string;
  categories: { id: number }[];
}

// サーバーから取得する投稿データ（取得用）
export interface Post {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  postCategories: {
    category: Category;
  }[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// 新規投稿（送信用）
//BasePostPayload（共通の投稿データ型）をそのまま継承した新規投稿用の型
export interface CreatePost extends BasePostPayload {}

// 更新投稿（送信用）
//BasePostPayload を継承しつつ、更新対象を識別するための id を必須追加した型
export interface UpdatePost extends BasePostPayload {
  id: number;
}
