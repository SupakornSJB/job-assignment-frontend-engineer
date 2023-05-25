import { useState, useEffect } from "react";
import { IProfileData } from "interface/userProfile";
import { axiosInstance } from "utils/axiosInstance";
import { useHistory, useLocation, useParams } from "react-router-dom";
import ArticleReview from "ArticleReview";
import { ArticleType } from "interface/article";
import { useAuth } from "contexts/AuthContext";
import { fetchFollowAuthorApi, mapAndChangeFavoriteInArticle } from "utils/followFavorite";
import profilePicPlaceholder from "./placeholder_profilepic.jpg"

const Profile: React.FunctionComponent = () => {
  const [userData, setUserData] = useState<IProfileData | null>(null);
  const [articleByUser, setArticleByUser] = useState<ArticleType[]>([]);
  const [articleFavByUser, setArticleFavByUser] = useState<ArticleType[]>([]);
  const [isOnFavoriteTab, setIsOnFavoriteTab] = useState(true);
  const { username } = useParams<{ username?: string }>();
  const { user, isLoggedIn, detect401 } = useAuth();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setUpUserProfile();
  }, [location.pathname]);

  useEffect(() => {
    if (userData) {
      setUpArticle();
    }
  }, [userData]);

  async function setUpUserProfile() {
    try {
      const response = await axiosInstance.get(`/profiles/${username}`);
      setUserData(response.data.profile);
    } catch (e: unknown) {
      detect401(e);
      console.error(e);
      history.push("/");
    }
  }

  async function setUpArticle() {
    try {
      const [articleWrittenByUserRes, articleFavoritedByUserRes] = await Promise.all([
        axiosInstance.get(`articles`, { params: { author: userData?.username } }),
        axiosInstance.get(`articles`, { params: { favorited: userData?.username } }),
      ]);

      setArticleByUser(articleWrittenByUserRes.data.articles);
      setArticleFavByUser(articleFavoritedByUserRes.data.articles);
    } catch (e: unknown) {
      detect401(e);
      console.error(e);
      history.push("/");
    }
  }

  function toggleFollowState(): void {
    setUserData(prev => {
      if (prev) {
        const newUserData: IProfileData = { ...prev };
        newUserData.following = !newUserData.following;
        return newUserData;
      }
      return prev;
    });
  }

  async function handleFollowAuthor(): Promise<void> {
    if (userData) {
      const prevUserDataState = { ...userData };
      toggleFollowState();

      try {
        await fetchFollowAuthorApi(!prevUserDataState.following, userData.username)
      } catch (e: unknown) {
        detect401(e);
        console.error(e);
        setUserData(prevUserDataState);
      }
    }
  }

  function setFavoriteState(slug: string): (setTo: boolean) => void {
    return (setTo: boolean) => {
      setArticleByUser(prevArticleList => mapAndChangeFavoriteInArticle(prevArticleList, setTo, slug));
      setArticleFavByUser(prevArticleList => mapAndChangeFavoriteInArticle(prevArticleList, setTo, slug));
      
      // if (isLoggedIn && userData?.username === user?.username) {

      // }
    };
  }

  return (
    <>
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img src={userData?.image === "" ? profilePicPlaceholder : userData?.image} className="user-img" />
                <h4>{userData?.username}</h4>
                <p>{userData?.bio}</p>

                <button
                  className={`btn btn-sm ${userData?.following ? "btn-secondary" : "btn-outline-secondary"} action-btn`}
                  onClick={handleFollowAuthor}
                  disabled={!isLoggedIn}
                >
                  <i className="ion-plus-round" />
                  &nbsp; Follow {userData?.username}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${isOnFavoriteTab ? "" : "active"} `}
                      onClick={() => setIsOnFavoriteTab(false)}
                      style={{outline: "none"}}
                    >
                      My Articles
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${isOnFavoriteTab ? "active" : ""}`}
                      onClick={() => setIsOnFavoriteTab(true)}
                      style={{outline: "none"}}
                    >
                      Favorited Articles
                    </button>
                  </li>
                </ul>
              </div>

              {isOnFavoriteTab
                ? articleFavByUser.map(article => (
                    <ArticleReview
                      article={article}
                      key={article.slug}
                      setFavoriteState={setFavoriteState(article.slug)}
                    />
                  ))
                : articleByUser.map(article => (
                    <ArticleReview
                      article={article}
                      key={article.slug}
                      setFavoriteState={setFavoriteState(article.slug)}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
