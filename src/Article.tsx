import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { ArticleGet } from "interface/article";
import { axiosInstance } from "utils/axiosInstance";
import { useAuth } from "contexts/AuthContext";
import { AxiosError } from "axios";
import { fetchFavoriteToggleApi } from "utils/followFavorite";

export default function Article() {
  const param = useParams<{ slug?: string }>();
  const [article, setArticle] = React.useState<ArticleGet | null>(null);
  const history = useHistory();
  const { logout } = useAuth();

  React.useEffect(() => {
    console.log(article);
  }, [article]);

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
      } catch (e: unknown) {
        console.error(e);
        history.push("/");
      }
    }

    fetchdata();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  function setToggleFavoriteState() {
    // set favorite state based to the opposite of "previous" state
    setArticle((prevState: ArticleGet | null) => {
      if (prevState) {
        const article: ArticleGet = {...prevState};
        if (!article.favorited) {
          article.favoritesCount += 1;
        } else {
          article.favoritesCount -= 1;
        }
        article.favorited = !article.favorited;
        return article
      }

      return prevState;
    })
  }

  async function toggleFavorite(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    if (article) {
      const prevArticleState = {...article}
      setToggleFavoriteState();
      if (!(await fetchFavoriteToggleApi(!prevArticleState.favorited, article.slug))) {
        setArticle(prevArticleState);
      }
    }
  }

  function setToggleFollowState(): void {
    console.log("h");
  }

  async function toggleFollow(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    console.log("a");
  }

  return (
    <>
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{article?.title}</h1>

            <div className="article-meta">
              <a href={`/#/profile/${article?.author.username}`}>
                <img src={article?.author.image} />
              </a>
              <div className="info">
                <a href={`/#/profile/${article?.author.username}`} className="author">
                  {article?.author.username}
                </a>
                <span className="date">January 20th</span>
              </div>
              <button className="btn btn-sm btn-outline-secondary">
                <i className="ion-plus-round" />
                &nbsp; Follow {article?.author.username} <span className="counter">(10)</span>
              </button>
              &nbsp;&nbsp;
              <button className="btn btn-sm btn-outline-primary" onClick={toggleFavorite}>
                <i className="ion-heart" />
                &nbsp; Favorite Post <span className="counter">{article?.favoritesCount}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <p>{article?.description}</p>
              <h2 id="introducing-ionic">{article?.title}</h2>
              <p>{article?.body}</p>
            </div>
          </div>

          <hr />

          <div className="article-actions">
            <div className="article-meta">
              <a href={`/#/profile/${article?.author.username}`}>
                <img src={article?.author.image} />
              </a>
              <div className="info">
                <a href={`/#/profile/${article?.author.username}`} className="author">
                  {article?.author.username}
                </a>
                <span className="date">{article?.updatedAt}</span>
              </div>
              <button className="btn btn-sm btn-outline-secondary">
                <i className="ion-plus-round" />
                &nbsp; Follow {article?.author.username}
              </button>
              &nbsp;
              <button className="btn btn-sm btn-outline-primary" onClick={toggleFavorite}>
                <i className="ion-heart" />
                &nbsp; Favorite Post <span className="counter">{article?.favoritesCount}</span>
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              <form className="card comment-form">
                <div className="card-block">
                  <textarea className="form-control" placeholder="Write a comment..." rows={3} />
                </div>
                <div className="card-footer">
                  <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                  <button className="btn btn-sm btn-primary">Post Comment</button>
                </div>
              </form>

              <div className="card">
                <div className="card-block">
                  <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                </div>
                <div className="card-footer">
                  <a href="/#/profile/jacobschmidt" className="comment-author">
                    <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                  </a>
                  &nbsp;
                  <a href="/#/profile/jacobschmidt" className="comment-author">
                    Jacob Schmidt
                  </a>
                  <span className="date-posted">Dec 29th</span>
                </div>
              </div>

              <div className="card">
                <div className="card-block">
                  <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                </div>
                <div className="card-footer">
                  <a href="/#/profile/jacobschmidt" className="comment-author">
                    <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                  </a>
                  &nbsp;
                  <a href="/#/profile/jacobschmidt" className="comment-author">
                    Jacob Schmidt
                  </a>
                  <span className="date-posted">Dec 29th</span>
                  <span className="mod-options">
                    <i className="ion-edit" />
                    <i className="ion-trash-a" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
