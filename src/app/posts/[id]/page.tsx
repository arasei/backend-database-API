'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import classes from '@/app/_styles/Detail.module.css';
import { Post } from '@/app/_types/PostsType';
import Image from 'next/image';



const HomeDetail: React.FC = () => {
  const params = useParams();
  const id = params['id'];

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetcher = async () => {
      if (!id) return;

      try {
        const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);
        const data = await res.json();
        setPost(data.post);
      } catch (error) {
        console.error('記事の取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [id]);

  if (loading) return<div>読み込み中...</div>
  if (!post) return<div>記事が見つかりません</div>


  return (
    <div className={classes.Container}>
      <div className={classes.post}>
        <div className={classes.postImage}>
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            height={400}
            width={800}
          />
        </div>
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
                )
              })}
            </div>
          </div>
          <div className={classes.postTitle}>{post.title}</div>
          <div className={classes.postBody} dangerouslySetInnerHTML={{__html: post.content}}/>
        </div>
      </div>
    </div>
  );
};

export default HomeDetail;

