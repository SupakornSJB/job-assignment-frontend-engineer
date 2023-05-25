import { useEffect, useState, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { axiosInstance } from "utils/axiosInstance";
import {
  MAX_ABOUT_LENGTH,
  MAX_ARTICLE_LENGTH,
  MAX_TAGS_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_TITLE_LENGTH,
} from "constant/constant";
import { ArticleCreateUpdate, Author } from "interface/article";
import { useAuth } from "contexts/AuthContext";
import { AxiosError, AxiosResponse } from "axios";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagList, setTagList] = useState("");
  const [error, setError] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const { slug } = useParams<{ slug?: string }>();
  const { user, detect401 } = useAuth();
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    setTitle("");
    setDescription("");
    setBody("");
    setTagList("");

    if (!user) {
      history.push("/");
    }

    if (slug) {
      (async () => {
        try {
          const response = await axiosInstance.get(`/articles/${slug}`, { signal: controller.signal });
          if (isMounted) {
            setTitle(response.data.article.title);
            setDescription(response.data.article.description);
            setBody(response.data.article.body);
            setAuthor(response.data.article.author);
          }
        } catch (e) {
          detect401(e);
          history.push("/");
          console.error(e);
        }
      })();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [location.pathname]);

  useEffect(() => {
    if (user && author && user.username !== author.username) {
      history.push("/");
    }
  }, [author]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH));
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setDescription(e.target.value.slice(0, MAX_ABOUT_LENGTH));
  }

  function handleBodyChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setBody(e.target.value.slice(0, MAX_ARTICLE_LENGTH));
  }

  function handleTagListChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setTagList(e.target.value.slice(0, MAX_TAGS_LENGTH));
  }

  function seperateTags(): string[] {
    return tagList.split(",");
  }

  async function handleArticleDelete(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    await axiosInstance.delete(`articles/${slug}`);
    history.push("/");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(false);

    if (title.length < MIN_TITLE_LENGTH) {
      setError(true);
      return;
    }

    const reqBody: { article: ArticleCreateUpdate } = {
      article: {
        title,
        description,
        body,
        tagList: seperateTags(),
      },
    };

    try {
      let response: AxiosResponse;
      if (slug) {
        response = await axiosInstance.put(`/articles/${slug}`, reqBody);
      } else {
        response = await axiosInstance.post("/articles", reqBody);
      }
      history.push(`/${response?.data.article.slug}`);
    } catch (e) {
      detect401(e);
      if (e instanceof AxiosError && e.response?.status === 409) {
        setError(true);
      }
      console.error(e);
    }
  }

  return (
    <>
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              {error && (
                <>
                  <div className="alert alert-danger">
                    <h4>Error, possible causes are</h4>

                    <ul>
                      <li>The article title is already taken</li>
                      <li>The article title is less than {MIN_TITLE_LENGTH} characters long</li>
                    </ul>
                  </div>
                </>
              )}
              <form onSubmit={handleSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Article Title"
                      onChange={handleTitleChange}
                      value={title}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What's this article about?"
                      onChange={handleDescriptionChange}
                      value={description}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows={8}
                      placeholder="Write your article (in markdown)"
                      onChange={handleBodyChange}
                      value={body}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter tags"
                      onChange={handleTagListChange}
                    />
                    <div className="tag-list" />
                  </fieldset>

                  <button className="btn btn-lg pull-xs-right btn-primary" type="submit">
                    Publish Article
                  </button>
                  {user && slug && user.username === author?.username && (
                    <>
                      <button
                        className="btn btn-lg pull-xs-right btn-danger"
                        onClick={handleArticleDelete}
                        style={{ marginRight: "10px" }}
                        type="button"
                      >
                        Delete Article
                      </button>
                    </>
                  )}
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
