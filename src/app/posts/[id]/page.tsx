"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; //next/navigationからuseParamsをインポートする
import { ArticlesCardDetail } from "./_components/ArticlesCardDetail";
import { Post } from "..//../_types/Post";
import Image from "next/image"; //Imageコンポーネントをインポート
import { supabase } from "@/utils/supabase";


//全体の概要
//指定された記事IDに基づいて記事の詳細情報とサムネイル画像を取得し、
//記事内容と関連カテゴリを表示するNext.jsのクライアントサイドコンポーネント


const PageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); //useParamsを使用してURLパラメータ(例:/posts/3)から記事ID(例の場合「3」)を取得。
  const [post, setPost] = useState<Post | null>(null); //postの状態管理、記事データを保持する状態変数。初期値はnull。
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string>(""); //サムネイル画像URLを保持
  const [isLoading, setIsLoading] = useState<boolean>(true); //ローディング状態

  //記事データの取得(API経由)、初回レンダリング時に実行
  useEffect(() => {
    const fetchPageDetail = async () => {
      setIsLoading(true); //ローディング開始、取得中はisLoadingをtrueにしてローディング表示
      try {
        const res = await fetch(`/api/posts/${id}`); //APIから記事データを取得、idに基づいて/api/posts/:idにGETリクエスト
        const data = await res.json();
        console.log("確認", data);
        setPost(data.post); //取得したデータをセット、postステートに保存
      } catch (error) {
        console.error("記事取得エラー", error);
      } finally {
        setIsLoading(false); //通信が終わったらローディング状態を解除
      }
    };
    fetchPageDetail();
  }, [id]); //IDが変わるたびに再実行
  
  //Supabaseから画像URLを取得
  useEffect(() => {
    if (!post?.thumbnailImageKey) return;//post.thumbnailImageKeyが存在する場合だけ下記の内容を実行
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage//supabase storageから画像の公開URL(public URL)を取得し、表示に使う。
        .from("post-thumbnail")
        .getPublicUrl(post.thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);//公開URLをステートに保存
    };

    fetcher();
  }, [post?.thumbnailImageKey]); //画像キーが変わったら実行

  //条件付き表示のロジック
  //ローディング中の処理　
  if (isLoading) {
    return <div>読み込み中…</div>;
  }
  // postが見つからなかった場合(postがnullの時)の処理
  if (!post) {
    return <div>記事はありません</div>;
  }
  return (
    <div>
      <div className="flex items-center justify-center">
        {/*JSX表示(実データを使って表示)*/}
        {/*supabaseの画像を表示*/}
        {thumbnailImageUrl && (
          <Image //<img>タグをnext/imageのImageコンポーネントに置き換え修正
            alt={post.title}
            className="mt-12"
            src={thumbnailImageUrl}
            height={400}
            width={800}
          />
        )}
      </div>
      <ArticlesCardDetail post={post} className="border-none" />{/*ArticlesCardDetailコンポーネントにpostを渡して記事の中身(本文やカテゴリー)を表示*/}
    </div>
  );
};
export default PageDetail;