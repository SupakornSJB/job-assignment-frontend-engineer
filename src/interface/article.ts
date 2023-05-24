export type ArticleGet = {
  author: {
    bio: string;
    following: boolean;
    image: string;
    username: string;
  };
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
  title: string,
  description: string,
  body: string,
  tagList?: string[]
};
