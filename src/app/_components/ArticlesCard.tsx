"use client";

import Link from "next/link";
import { Post } from "../_types/Post";

type ArticlesCardProps = {
  post: Post;
};

//全体の概要
//記事一覧ページなどで使用するReactコンポーネントで、１つの記事(投稿)の概要(タイトル.本文.作成日.カテゴリー)をカード形式で表示し、クリックするとその記事の詳細ページ(/posts/{id})へ遷移する処理を行う。

//ArticlesCardコンポーネントは記事一覧ページなどで１つの記事カードを表示する役割

export const ArticlesCard: React.FC<ArticlesCardProps> = ({ post }) => {
  const date = new Date(post.createdAt).toLocaleDateString("ja-JP");
  return (
    <Link
      href={`/posts/${post.id}`}
      className={`block border border-gray-400 my-8 mx-auto py-4 pl-6 pr-20 w-[800px] max-w-[800px]`} 
    >{/*カード全体をリンクに、クリックすると詳細ページ(/posts/{id}へ遷移)*/}
      <div className="text-sm float-left">{date}</div>
      <div className="float-right">
        {/*記事に紐づくカテゴリーを全て表示*/}
        {post.postCategories.map((postCategory) => (
          <button
            key={postCategory.category.id} //正しく要素を識別できるように修正→indexは不要
            className="px-2 py-0 mx-1 text-blue-500 border border-blue-500  rounded"
          >
            {postCategory.category.name}
          </button>
        ))}
      </div>
      <div className="clear-both text-left pt-4">{post.title}</div>{/*floatを解除するためにclear-bothを使い、レイアウトの崩れを防止*/}
      <div
        className="pt-4 line-clamp-3"//3行に制限
        dangerouslySetInnerHTML={{ __html: post.content }}//HTMLとしてレンダリングする必要があるためdangerouslySetInnerHTMLを使用して HTML本文を表示
      ></div>
    </Link>
  );
};
