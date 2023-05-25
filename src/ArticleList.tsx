import { AxiosResponse } from "axios";
import { useAuth } from "contexts/AuthContext";
import { axiosInstance } from "utils/axiosInstance";
import React from "react";
import { ArticleType } from "interface/article";
import ArticleReview from "ArticleReview";
import { mapAndChangeFavoriteInArticle } from "utils/followFavorite"

const ArticleList: React.FunctionComponent = () => {
  const [globalArticleList, setGlobalArticleList] = React.useState<ArticleType[]>([]);
  const [userArticleList, setUserArticleList] = React.useState<ArticleType[]>([]);
  const [isGlobalTab, setIsGlobalTab] = React.useState(true);
  const { isLoggedIn, detect401 } = useAuth();

  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    (async () => {
      try {
        let [globalArticle, userArticle]: [AxiosResponse | null, AxiosResponse | null] = [null, null];
        [globalArticle, userArticle] = await Promise.all([
          axiosInstance.get("/articles", { signal: controller.signal }),
          isLoggedIn ? axiosInstance.get("/articles/feed", { signal: controller.signal }) : null,
        ]);
        if (isMounted) {
          setGlobalArticleList(globalArticle.data.articles);
          setUserArticleList(userArticle ? userArticle.data.articles : []);
        }
      } catch (e) {
        detect401(e);
        console.error(e);
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  function setFavoriteState(slug: string): (setTo: boolean) => void {
    return (setTo: boolean) => {
      setGlobalArticleList((prevArticleList) => mapAndChangeFavoriteInArticle(prevArticleList, setTo, slug));
      setUserArticleList((prevArticleList) => mapAndChangeFavoriteInArticle(prevArticleList, setTo, slug));
    };
  }

  return (
    <>
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  {isLoggedIn && (
                    <li className="nav-item">
                      <a
                        className={`nav-link ${isGlobalTab ? "" : "active"}`}
                        onClick={() => setIsGlobalTab(false)}
                        href="#"
                      >
                        Your Feed
                      </a>
                    </li>
                  )}
                  <li className="nav-item">
                    <a
                      className={`nav-link ${isGlobalTab ? "active" : ""}`}
                      onClick={() => setIsGlobalTab(true)}
                      href="#"
                    >
                      Global Feed
                    </a>
                  </li>
                </ul>
              </div>
              {isGlobalTab
                ? globalArticleList?.map(article => (
                    <ArticleReview
                      article={article}
                      key={article.slug}
                      setFavoriteState={setFavoriteState(article.slug)}
                    />
                  ))
                : userArticleList?.map(article => (
                    <ArticleReview
                      article={article}
                      key={article.slug}
                      setFavoriteState={setFavoriteState(article.slug)}
                    />
                  ))}
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <div className="tag-list">
                  <a href="" className="tag-pill tag-default">
                    programming
                  </a>
                  <a href="" className="tag-pill tag-default">
                    javascript
                  </a>
                  <a href="" className="tag-pill tag-default">
                    emberjs
                  </a>
                  <a href="" className="tag-pill tag-default">
                    angularjs
                  </a>
                  <a href="" className="tag-pill tag-default">
                    react
                  </a>
                  <a href="" className="tag-pill tag-default">
                    mean
                  </a>
                  <a href="" className="tag-pill tag-default">
                    node
                  </a>
                  <a href="" className="tag-pill tag-default">
                    rails
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleList;
