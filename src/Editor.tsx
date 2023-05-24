import { useState } from "react";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "functions/axiosInstance";

const MAX_TITLE_LENGTH = 9999;
const MAX_ABOUT_LENGTH = 9999;
const MAX_ARTICLE_LENGTH = 9999;
const MAX_TAGS_LENGTH = 9999;

export default function Editor() {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [articleText, setArticle] = useState("");
  const [tags, setTags] = useState("");
  const history = useHistory();

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH));
  } 

  function handleAboutChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setAbout(e.target.value.slice(0, MAX_ABOUT_LENGTH));
  }

  function handleArticleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setArticle(e.target.value.slice(0, MAX_ARTICLE_LENGTH));
  }

  function handleTagsChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setTags(e.target.value.slice(0, MAX_TAGS_LENGTH));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    console.log("submitting");

    history.push("/");
  }

  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container">
          <a className="navbar-brand" href="/#">
            conduit
          </a>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              {/* Add "active" class when you're on that page" */}
              <a className="nav-link active" href="/#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/editor">
                <i className="ion-compose" />
                &nbsp;New Article
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/settings">
                <i className="ion-gear-a" />
                &nbsp;Settings
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/login">
                Sign in
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/register">
                Sign up
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <form onSubmit={handleSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input type="text" className="form-control form-control-lg" placeholder="Article Title" onChange={handleTitleChange}/>
                  </fieldset>
                  <fieldset className="form-group">
                    <input type="text" className="form-control" placeholder="What's this article about?" onChange={handleAboutChange}/>
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea className="form-control" rows={8} placeholder="Write your article (in markdown)" onChange={handleArticleChange}/>
                  </fieldset>
                  <fieldset className="form-group">
                    <input type="text" className="form-control" placeholder="Enter tags" onChange={handleTagsChange}/>
                    <div className="tag-list" />
                  </fieldset>
                  <button className="btn btn-lg pull-xs-right btn-primary" type="submit">
                    Publish Article
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="container">
          <a href="/#" className="logo-font">
            conduit
          </a>
          <span className="attribution">
            An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </>
  );
}
