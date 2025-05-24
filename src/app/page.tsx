'use client';

import React,{ useState, useEffect } from "react";
import classes from '@/app/_styles/Home.module.css';
import Link from 'next/link';
import { Post } from '@/app/_types/PostsType';




export default function Home() {
  const [posts, setPots] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts`);
        const data = await res.json();
        console.log("取得記事:",data);
        setPots(data.posts);
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
                              <div key={category} className={classes.postCategory}>
                                {category}
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