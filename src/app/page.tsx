'use client';

import React,{ useState, useEffect } from "react";
import classes from '@/app/_styles/Home.module.css';
import Link from 'next/link';
import { Post,MicroCmsPost } from '@/app/_types/PostsType';




export default function Home() {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`https://1kt3z4pfn4.microcms.io/api/v1/posts`,{
          headers: {
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
          }
        });
        const data = await res.json();
        console.log("✅ APIレスポンス", data);
        setPosts(data.contents);
      } catch (error) {
        console.error("記事一覧取得に失敗", error);
      }
      setLoading(false);
    };

    fetcher();
  },[]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="">
      <div className={classes.container}>
        <ul>
          {/*記事の一覧をmap処理で繰り返す */}
          {posts.map((post) => {
            return (
              <li key={post.id} className={classes.list}>
                <Link href={`/posts/${post.id}`} className={classes.link}>
                  <div className={classes.post}>
                    <div className={classes.postContent}>
                      <div className={classes.postInfo}>
                        <div className={classes.postDate}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className={classes.postCategories}>
                          {post.categories.map((category) => {
                            return (
                              <div key={category.id} className={classes.postCategory}>
                                {category.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <p className={classes.postTitle}>{post.title}</p>
                      <div className={classes.postBody} dangerouslySetInnerHTML={{__html: post.content}}></div>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
};