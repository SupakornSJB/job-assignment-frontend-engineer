import { useState, useEffect } from "react";
import { IProfileData, IUserData } from "interface/userProfile";
import { axiosInstance } from "utils/axiosInstance";
import { useHistory, useParams } from "react-router-dom";
import ArticleReview from "ArticleReview";
import { ArticleGet } from "interface/article";
import { useAuth } from "contexts/AuthContext";
import { fetchFollowAuthorApi, mapAndSetFavoriteInArticle } from "utils/followFavorite";

const Profile: React.FunctionComponent = () => {
  const [userData, setUserData] = useState<IProfileData | null>(null);
  const [articleByUser, setArticleByUser] = useState<ArticleGet[]>([]);
  const [articleFavByUser, setArticleFavByUser] = useState<ArticleGet[]>([]);
  const [isOnFavoriteTab, setIsOnFavoriteTab] = useState(true);
  const { username } = useParams<{ username?: string }>();
  const { user, isLoggedIn } = useAuth();
  const history = useHistory();

  useEffect(() => {
    setUpUserProfile();
  }, []);

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
      if (!(await fetchFollowAuthorApi(!prevUserDataState.following, userData.username))) {
        setUserData(prevUserDataState);
      }
    }
  }

  function setFavoriteState(slug: string): (setTo: boolean) => void {
    // TODO : implement this
    // set the favorite and favCount state on the parent (this) component
    return (setTo: boolean) => {
      setArticleByUser((prevArticleList) => mapAndSetFavoriteInArticle(prevArticleList, setTo, slug));
      setArticleFavByUser((prevArticleList) => mapAndSetFavoriteInArticle(prevArticleList, setTo, slug));
    };
  }

  return (
    <>
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img src={userData?.image} className="user-img" />
                <h4>{userData?.username}</h4>
                <p>{userData?.bio}</p>
                {!(user?.username === userData?.username) && isLoggedIn && (
                  <button
                    className={`btn btn-sm ${
                      userData?.following ? "btn-secondary" : "btn-outline-secondary"
                    } action-btn`}
                    onClick={handleFollowAuthor}
                  >
                    <i className="ion-plus-round" />
                    &nbsp; Follow {userData?.username}
                  </button>
                )}
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
                    <a
                      className={`nav-link ${isOnFavoriteTab ? "" : "active"} `}
                      onClick={() => setIsOnFavoriteTab(false)}
                    >
                      My Articles
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${isOnFavoriteTab ? "active" : ""}`}
                      onClick={() => setIsOnFavoriteTab(true)}
                    >
                      Favorited Articles
                    </a>
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
