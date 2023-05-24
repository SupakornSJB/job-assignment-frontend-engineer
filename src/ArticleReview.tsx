import React from "react";
import { useAuth } from "contexts/AuthContext";
import { ArticleGet } from "interface/article";
import { fetchFavoriteToggleApi } from "utils/followFavorite";

const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

const ArticleReview: React.FunctionComponent<{ article: ArticleGet; setFavoriteState: (setTo: boolean) => void }> = ({
  article,
  setFavoriteState,
}) => {
  // const [isFavorited, setIsFavorited] = React.useState(false);
  // const [favCount, setFavCount] = React.useState(0);
  const { isLoggedIn } = useAuth();

  // React.useEffect(() => {
  //   let isMounted = true;
  //   if (isMounted) {
  //     setIsFavorited(article.favorited);
  //     setFavCount(article.favoritesCount);
  //   }
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  async function toggleFavorite() {
    const prevFavoriteState = article.favorited
    // if (isFavorited) {
    //   setFavCount(prev => prev - 1);
    //   setIsFavorited(false);
    // } else {
    //   setFavCount(prev => prev + 1);
    //   setIsFavorited(true);
    // }
    setFavoriteState(!prevFavoriteState);

    if (!(await fetchFavoriteToggleApi(!prevFavoriteState, article.slug))) {
      // setFavCount(prevFavCount);
      // setIsFavorited(prevFav);
      setFavoriteState(prevFavoriteState);
    }
  }

  return (
    <>
      <div className="article-preview">
        <div className="article-meta">
          <a href={`/#/profile/${article.author.username}`}>
            <img src={article.author.image} />
            {/* <img src={article.author.image} alt={article.author.username}/> */}
          </a>
          <div className="info">
            <a href={`/#/profile/${article.author.username}`} className="author">
              {article.author.username}
            </a>
            <span className="date">{new Date(article.createdAt).toLocaleDateString(undefined, dateOptions)}</span>
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
