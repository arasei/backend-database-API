"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

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
const AdminPostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);//初期値は空配列に。空配列なら.map()が正常に動作し何も表示されないだけで済むため安全。
  const { token } = useSupabaseSession();//認証トークンを取得

  //useEffectの処理は、初回or token変更時に行う
  //管理者(ログイン済ユーザー)だけに記事を表示したいのでtokenを使用
  //useEffectを使用することで、tokenが取得できた時点で初めてAPIを呼び実行できる
  //最初のレンダリングでは token は undefined か null の場合がある為
  useEffect(() => {
    if (!token) return;//トークンがなければAPI呼び出ししない。もしトークンがなければreturn;で処理を中断。

    const fetchPosts = async () => {
      try {
        //トークンがある時だけfetch("/api/admin/posts")が実行する。
        const res = await fetch("/api/admin/posts", {
          headers: {
            "Content-Type": "application/json",
            //下記の行により、APIは「正しいトークンを持ったユーザーだけ」に記事一覧を返すように制限できる。
            Authorization: token,//トークンをヘッダーに付与する。正しいトークンを
          },
        });
        const data = await res.json();
        setPosts(data.posts);//結果をステートに保存
      } catch (error) {
        console.error("記事取得エラー",error);
      }
    };
    fetchPosts();
  }, [token]);//トークンが準備できたらfetchを実行

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