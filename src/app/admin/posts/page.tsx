"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

//全体の概要
// このコンポーネントは、Supabase の認証トークンを使ってログイン中の管理者だけがアクセスできる記事一覧ページを表示し、
// 記事ごとにリンク付きで詳細ページに飛べるようにする管理画面機能です。

type Category = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  title: string;
  createdAt: string;//作成日時
  postCategories: {
    category: Category;
  }[];
};

//記事一覧ページ
const AdminPostPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);//初期値は空配列に。空配列なら.map()が正常に動作し何も表示されないだけで済むため安全。
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/posts");
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("記事取得エラー", error);
      }
    };
    fetchPosts();
  }, []);

  
  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-9 mt-2">
        <h1 className="text-lg font-bold mb-9 mt-2">記事一覧</h1>
        <Link
          href="/admin/posts/new"
          className="py-2 px-4 border rounded-lg text-white bg-blue-700"
        >
          新規作成
        </Link>
      </div>
      <div>
        {/*記事が1件以上ある場合の表示*/}
        {posts.length ? (
          posts.map((post) => (
            //各記事を順番に表示
            <div key={post.id}>
              <Link href={`/admin/posts/${post.id}`}>
                <h2 className="font-black">{post.title}</h2>
              </Link>
              <p>
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          //記事がない場合の表示
          <p>記事がありません</p>
        )}
      </div>
    </div>
  );
};

export default AdminPostPage;