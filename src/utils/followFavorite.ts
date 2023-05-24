import { axiosInstance } from "./axiosInstance";
import { AxiosError } from "axios";
import { ArticleGet } from "interface/article";

export async function fetchFavoriteToggleApi(favorite: boolean, slug: string): Promise<boolean> {
  // fetch the api based on "current" favorite state
  if (favorite === undefined || slug === undefined) {
    return false;
  }

  try {
    if (favorite) {
      console.log(`fav: ${favorite}, api: POST`)
      await axiosInstance.post(`/articles/${slug}/favorite`);
    } else {
      console.log(`fav: ${favorite}, api: DELETE`)
      await axiosInstance.delete(`/articles/${slug}/favorite`);
    }
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof AxiosError && e.response?.status === 401) {
      console.error("error 401");
    }
    return false;
  }

  return true;
}

export async function fetchFollowAuthorApi(follow: boolean, username: string): Promise<boolean> {
  if (!username) return false;

  try {
    if (follow) {
      console.log(`follow: ${follow}, api: DELETE`)
      await axiosInstance.post(`profiles/${username}/follow`);
    } else {
      console.log(`follow: ${follow}, api: DELETE`)
      await axiosInstance.delete(`profiles/${username}/follow`);
    }
  } catch (e: unknown) {
    console.error(e);
    return false;
  }

  return true;
}

export function mapAndSetFavoriteInArticle(prevArticleList: ArticleGet[], setTo: boolean, slug: string): ArticleGet[] {
  const newArticleList = prevArticleList.map(prevArticle => {
    if (prevArticle.slug === slug) {
      const newArticle = { ...prevArticle };
      if (setTo && !prevArticle.favorited) {
        newArticle.favorited = true;
        newArticle.favoritesCount += 1;
      } else if (!setTo && prevArticle.favorited) {
        newArticle.favorited = false;
        newArticle.favoritesCount -= 1;
      }
      return newArticle;
    } else {
      return prevArticle;
    }
  });

  return newArticleList;
}