import React from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { ArticleType } from "interface/article";
import { axiosInstance } from "utils/axiosInstance";
import { useAuth } from "contexts/AuthContext";
import { AxiosError } from "axios";
import { changeFavoriteInArticleState, fetchFavoriteToggleApi, fetchFollowAuthorApi } from "utils/followFavorite";
import CommentSection from "CommentSection";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import placeHolderimg from "./placeholder_profilepic.jpg";
import { formatDate } from "utils/dateFormat";

export default function Article() {
  const param = useParams<{ slug?: string }>();
  const [article, setArticle] = React.useState<ArticleType | null>(null);
  const history = useHistory();
  const location = useLocation();
  const { user, isLoggedIn, detect401 } = useAuth();

  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchdata(): Promise<void> {
      try {
        if (!param.slug) {
          throw new Error();
        }
        const response = await axiosInstance.get(`/articles/${param.slug}`);
        if (isMounted) {
          setArticle(response.data.article);
        }
      } catch (e) {
        detect401(e);
        console.error(e);
        history.push("/");
      }
    }

    fetchdata();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [location.pathname]);

  function setToggleFavoriteState() {
    // set favorite state based to the opposite of "previous" state
    setArticle(prevArticle => (prevArticle ? changeFavoriteInArticleState(prevArticle, !prevArticle.favorited) : null));
  }

  async function toggleFavorite(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    if (article) {
      const prevArticleState = { ...article };
      setToggleFavoriteState();

      try {
        await fetchFavoriteToggleApi(!prevArticleState.favorited, article.slug);
      } catch (e) {
        detect401(e);
        console.error(e);
        setArticle(prevArticleState);
      }
    }
  }

  function setToggleFollowState(): void {
    if (article) {
      setArticle({
        ...article,
        author: {
          // Why is nested object updating in react overly complicated lol
          ...article.author,
          following: !article.author.following,
        },
      });
    }
  }

  async function toggleFollow(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    if (article) {
      const prevArticleState = { ...article };
      setToggleFollowState();

      try {
        await fetchFollowAuthorApi(!prevArticleState.author.following, prevArticleState.author.username);
      } catch (e) {
        detect401(e);
        console.error(e);
        setArticle(prevArticleState);
      }
    }
  }

  return (
    <>
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{article?.title}</h1>

            <div className="article-meta">
              <a href={`/#/profile/${article?.author.username}`}>
                <img src={article?.author.image === "" ? placeHolderimg : article?.author.image} />
              </a>
              <div className="info">
                <a href={`/#/profile/${article?.author.username}`} className="author">
                  {article?.author.username}
                </a>
                {article && <span className="date">{formatDate(article.updatedAt)}</span>}
              </div>
              <button
                className={`btn btn-sm ${article?.author.following ? "btn-secondary" : "btn-outline-secondary"}`}
                onClick={toggleFollow}
                disabled={!isLoggedIn}
              >
                <i className="ion-plus-round" />
                &nbsp; Follow {article?.author.username}
              </button>
              &nbsp;&nbsp;
              <button
                className={`btn btn-sm ${article?.favorited ? "btn-primary" : "btn-outline-primary"}`}
                onClick={toggleFavorite}
                disabled={!isLoggedIn}
              >
                <i className="ion-heart" />
                &nbsp; Favorite Post <span className="counter">({article?.favoritesCount})</span>
              </button>
              &nbsp;&nbsp;
              {isLoggedIn && user?.username === article?.author.username ? (
                <>
                  <button
                    className={`btn btn-sm btn-outline-warning`}
                    onClick={() => history.push(`/editor/${article?.slug}`)}
                    disabled={!isLoggedIn}
                  >
                    <i className="ion-android-create" />
                    &nbsp; Edit/Delete Article
                  </button>
                  &nbsp;&nbsp;
                  
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <p>{article?.description}</p>
              <h2 id="introducing-ionic">{article?.title}</h2>
              {article && <ReactMarkdown>{article.body}</ReactMarkdown>}
            </div>
          </div>

          <hr />

          <div className="article-actions">
            <div className="article-meta">
              <a href={`/#/profile/${article?.author.username}`}>
                <img src={article?.author.image === "" ? placeHolderimg : article?.author.image} />
              </a>
              <div className="info">
                <a href={`/#/profile/${article?.author.username}`} className="author">
                  {article?.author.username}
                </a>
                {article && <span className="date">{formatDate(article.updatedAt)}</span>}
              </div>
              <button
                className={`btn btn-sm ${article?.author.following ? "btn-secondary" : "btn-outline-secondary"}`}
                onClick={toggleFollow}
                disabled={!isLoggedIn}
              >
                <i className="ion-plus-round" />
                &nbsp; Follow {article?.author.username}
              </button>
              &nbsp;
              <button
                className={`btn btn-sm ${article?.favorited ? "btn-primary" : "btn-outline-primary"}`}
                onClick={toggleFavorite}
                disabled={!isLoggedIn}
              >
                <i className="ion-heart" />
                &nbsp; Favorite Post <span className="counter">{article?.favoritesCount}</span>
              </button>
            </div>
          </div>

          {article && <CommentSection slug={article.slug} />}
        </div>
      </div>
    </>
  );
}
