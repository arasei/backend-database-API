export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  categories: string[];
  thumbnailUrl: string;
};

export interface MicroCmsPost {
  id: string
  title: string
  content: string
  createdAt: string
  categories: { id: string; name: string }[]
  thumbnail: { url: string; height: number; width: number }
}