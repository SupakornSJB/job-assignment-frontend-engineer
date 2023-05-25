export type Author = {
  bio: string;
  following: boolean;
  image: string;
  username: string;
};

export type ArticleType = {
  author: Author;
  body: string;
  createdAt: string; // TODO: translate to date
  description: string;
  favorited: boolean;
  favoritesCount: number;
  slug: string;
  tagList: string[];
  title: string;
  updatedAt: string; // TODO: translate to date
};

export type ArticleCreateUpdate = {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
};

export type ArticleComment = {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Author;
};
