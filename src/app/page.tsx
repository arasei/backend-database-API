"use client"; //クライアントサイドで実行


//トップページで投稿記事一覧を表示する。
import { useEffect, useState } from "react";
import { ArticlesCard } from "./_components/ArticlesCard";
import { Post } from "./_types/Post";


//全体の概要
//クライアント側で実行されるReactコンポーネントで、Next.jsのAPIから記事一覧を取得し、取得した投稿データをArticlesCardコンポーネントを使ってトップページに一覧表示する処理。


// type ApiResponse = {
//   message: string;
//   posts: MicroCmsPost[];
// };

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]); // postsの型を指定、初期値は空の配列
  const [isLoading, setIsLoading] = useState<boolean>(true); // isLoadingの型を指定、初期状態はtrue(ロード中)
  // API呼び出しを行う関数
  //初回レンダリング時の処理を記述
  useEffect(() => {
    const getApi = async () => {
      const res = await fetch("/api/posts");//作成したAPIを呼び出し、記事データを取得、記事一覧を取得する為のエンドポイント
      const { data } = await res.json();//dataの配列をオブジェクトとして取り出す
      console.log(posts);
      //postCategories(中間テーブル)からcategoryを抽出し、categoriesプロパティに変換
      //data.postsはAPIから返ってきた記事の一覧配列
      const transformedPosts = data.posts.map((post: any) => ({
        ...post,
        categories: post.postCategories.map((pc: any) => pc.category),
      }));
      setPosts(transformedPosts);//整形済みの投稿データ(transformedPosts)をpostsの状態に保存
      setIsLoading(false);//isLoadingをfalseにしてローディング状態を解除
    };
    getApi();
  }, []);//依存配列を空にしてこのuseEffectは初回レンダリング時のみ実行

  //ローディング中の処理
  if (isLoading) {
    return <div>読み込み中…</div>;
  }
  // 記事一覧データのAPIデータがない場合の処理(データ取得したが、postsが空配列時の処理)
  if (posts.length === 0) {
    return <div>記事一覧はありません</div>;
  }
  return (
    <div>
      {/*取得したpostsをmapで繰り返し、各投稿データ(postsオブジェクト)をArticlesCardコンポーネントに渡してリスト表示*/}
      {posts.map((post) => (
        //key={post.id}を指定してReactがリストを効率的に更新できるようにする。
        <ArticlesCard key={post.id} post={post} /> 
      ))}
    </div>
  );
};
export default Posts;