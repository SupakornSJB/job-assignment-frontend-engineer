import { axiosInstance } from "./axiosInstance";
import { AxiosError } from "axios";
import { ArticleType } from "interface/article";

export async function fetchFavoriteToggleApi(favorite: boolean, slug: string): Promise<boolean> {
  // fetch the api based on "current" favorite state
  if (favorite === undefined || slug === undefined) {
    return false;
  }

  if (favorite) {
    // console.log(`fav: ${favorite}, api: POST`);
    await axiosInstance.post(`/articles/${slug}/favorite`);
  } else {
    // console.log(`fav: ${favorite}, api: DELETE`);
    await axiosInstance.delete(`/articles/${slug}/favorite`);
  }

  return true;
}

export async function fetchFollowAuthorApi(follow: boolean, username: string): Promise<boolean> {
  if (!username) return false;

  try {
    if (follow) {
      // console.log(`follow: ${follow}, api: POST`);
      await axiosInstance.post(`profiles/${username}/follow`);
    } else {
      // console.log(`follow: ${follow}, api: DELETE`);
      await axiosInstance.delete(`profiles/${username}/follow`);
    }
  } catch (e) {
    console.error(e);
    return false;
  }

  // console.log("fetch follow success");
  return true;
}

export function mapAndChangeFavoriteInArticle(
  prevArticleList: ArticleType[],
  setTo: boolean,
  slug: string
): ArticleType[] {
  const newArticleList = prevArticleList.map(prevArticle => {
    if (prevArticle.slug === slug) {
      return changeFavoriteInArticleState(prevArticle, setTo);
    }
    return prevArticle;
  });

  return newArticleList;
}

export function changeFavoriteInArticleState(prevArticle: ArticleType, setTo: boolean): ArticleType {
  const article: ArticleType = { ...prevArticle };
  if (setTo && !prevArticle.favorited) {
    article.favorited = true;
    article.favoritesCount += 1;
  } else if (!setTo && prevArticle.favorited) {
    article.favorited = false;
    article.favoritesCount -= 1;
  }
  return article;
}
