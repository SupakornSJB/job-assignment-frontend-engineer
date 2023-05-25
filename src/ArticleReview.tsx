import React from "react";
import { useAuth } from "contexts/AuthContext";
import { ArticleType } from "interface/article";
import { fetchFavoriteToggleApi } from "utils/followFavorite";
import phimg from "./placeholder_profilepic.jpg"
import { formatDate } from "utils/dateFormat";

const ArticleReview: React.FunctionComponent<{ article: ArticleType; setFavoriteState: (setTo: boolean) => void }> = ({
  article,
  setFavoriteState,
}) => {
  const { isLoggedIn, detect401 } = useAuth();

  async function toggleFavorite() {
    const prevFavoriteState = article.favorited
    setFavoriteState(!prevFavoriteState);

    try {
      await fetchFavoriteToggleApi(!prevFavoriteState, article.slug)
    } catch (e: unknown) {
      detect401(e);
      console.error(e);
      setFavoriteState(prevFavoriteState);
    }
  }

  return (
    <>
      <div className="article-preview">
        <div className="article-meta">
          <a href={`/#/profile/${article.author.username}`}>
            <img src={article.author.image === "" ? phimg : article.author.image} />
          </a>
          <div className="info">
            <a href={`/#/profile/${article.author.username}`} className="author">
              {article.author.username}
            </a>
            <span className="date">{formatDate(article.updatedAt)}</span>
          </div>
          <button
            className={`btn ${article.favorited && isLoggedIn ? "btn-primary" : "btn-outline-primary"} btn-sm pull-xs-right`}
            onClick={toggleFavorite}
            disabled={!isLoggedIn}
          >
            <i className="ion-heart" /> {article.favoritesCount}
          </button>
        </div>
        <a href={`/#/${article.slug}`} className="preview-link">
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <span>Read more...</span>
        </a>
      </div>
    </>
  );
};

export default ArticleReview;
