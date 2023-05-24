import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { axiosInstance } from "utils/axiosInstance";
import { MAX_ABOUT_LENGTH, MAX_ARTICLE_LENGTH, MAX_TAGS_LENGTH, MAX_TITLE_LENGTH } from "constant/constant";
import { ArticleCreateUpdate } from "interface/article";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagList, setTagList] = useState("");
  const history = useHistory();
  const { slug } = useParams<{ slug?: string }>();

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
    return tagList.split(",")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const reqBody: {article: ArticleCreateUpdate} = {
      article: {
        title,
        description,
        body,
        tagList: seperateTags()
      }
    }

    console.log(reqBody);
    try {
      const response = await axiosInstance.post("/articles", reqBody);
      console.log(response.data);
    } catch (e: unknown) {
      console.error(e);
    }
    history.push("/");
  }

  return (
    <>
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <form onSubmit={handleSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Article Title"
                      onChange={handleTitleChange}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What's this article about?"
                      onChange={handleDescriptionChange}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows={8}
                      placeholder="Write your article (in markdown)"
                      onChange={handleBodyChange}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input type="text" className="form-control" placeholder="Enter tags" onChange={handleTagListChange} />
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
    </>
  );
}
