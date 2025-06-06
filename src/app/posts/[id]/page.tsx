'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import classes from '@/app/_styles/Detail.module.css';
import { Post, MicroCmsPost } from '@/app/_types/PostsType';
import Image from 'next/image';



const HomeDetail: React.FC = () => {
  const params = useParams();
  const id = params['id'];

  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`https://1kt3z4pfn4.microcms.io/api/v1/posts/${id}`,{
          headers: {
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
          }
        });
        const data = await res.json();
        setPost(data);
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
            src={post.thumbnail.url}
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
                  <div key={category.id} className={classes.postCategory}>
                    {category.name}
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