"use client"; //クライアントサイドで実行

import { useEffect, useState } from "react";
import { ArticlesCard } from "./_components/ArticlesCard";
import { Post } from "./_types/Post";


// type ApiResponse = {
//   message: string;
//   posts: MicroCmsPost[];
// };

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]); // postsの型を指定
  const [isLoading, setIsLoading] = useState<boolean>(true); // isLoadingの型を指定
  // API呼び出しを行う関数
  useEffect(() => {
    const getApi = async () => {
      const res = await fetch("/api/admin/posts");//作成したAPIを呼び出す
      const { posts } = await res.json();//postsの配列を取り出す
      console.log(posts);
      setPosts(posts);//投稿一覧をステートに保存
      setIsLoading(false);//ローディング状態を解除
    };
    getApi();
  }, []);
  //ローディング中の処理
  if (isLoading) {
    return <div>読み込み中…</div>;
  }
  // 記事一覧データのAPIデータがない場合の処理(データ取得し、postsが空配列)
  if (posts.length === 0) {
    return <div>記事一覧はありません</div>;
  }
  return (
    <div>
      {posts.map((post) => (
        //key={post.id}を指定してReactがリストの再描画を最適化できるようにする。
        // 投稿データ(postオブジェクト)をArticlesCardに渡す
        <ArticlesCard key={post.id} post={post} /> 
      ))}
    </div>
  );
};
export default Posts;