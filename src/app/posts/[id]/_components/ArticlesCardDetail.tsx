"use client";

import { Post } from "../../../_types/Post";

//全体の概要
//特定の投稿記事の詳細を表示するためのReactコンポーネント。
//記事のタイトル・内容・作成日・関連カテゴリーを見やすくレイアウトして表示します。

//propsの型定義
//postは必須、classNameは任意でスタイル追加に使用する
type ArticlesCardDetailProps = {
  post: Post;
  className?: string;//classNameは省略可能に設定
};

export const ArticlesCardDetail: React.FC<ArticlesCardDetailProps> = ({
  //postデータとCSSクラスを受け取る。
  post,
  className,
}) => {
  //日付表示を変更(YYYY/MM/DD形式)
  const date = new Date(post.createdAt).toLocaleDateString("ja-JP");
  return (
    <div className={`block border-gray-400 my-8 mx-auto py-4 pl-6 pr-20 w-[800px] max-w-[800px] ${className}`}>
      <div className="text-sm float-left">{/*左側に投稿日を小さな文字で表示*/}
        {date}
      </div>
      <div className="float-right">
        {/*右側にカテゴリーボタンを並べる。?.でnull安全に対応*/}
        {post.postCategories?.map((postCategory) => (
          //カテゴリー名をボタン形式で表示
          <button key={postCategory.category.id} //正しく要素を識別できるように修正→indexは不要
          className="px-2 py-0 mx-1 text-blue-500 border border-blue-500 rounded"
          >
            {postCategory.category.name}
          </button>
        ))}
      </div>
      <div className="clear-both text-left pt-4">{/*clear-bothで上記のfloatに影響されないように*/}
        {post.title}
      </div>
      <div className="pt-4"
      //HTML形式の本文を表示。
      //dangerouslySetInnerHTMLを使ってHTMLをそのままレンダリング。
      dangerouslySetInnerHTML={{__html: post.content}}
      ></div>
    </div>
  );
};