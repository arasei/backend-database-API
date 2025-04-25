//Post 型の定義
export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  categories: string[];
  thumbnailUrl: string;
}