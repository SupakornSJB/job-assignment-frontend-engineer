import { MAX_COMMENT_LENGTH, MIN_COMMENT_LENGTH } from "constant/constant";
import { useAuth } from "contexts/AuthContext";
import { ArticleComment } from "interface/article";
import React from "react";
import { axiosInstance } from "utils/axiosInstance";
import phimg from "./placeholder_profilepic.jpg"
import { formatDate } from "utils/dateFormat";

const CommentSection: React.FunctionComponent<{ slug: string }> = ({ slug }) => {
  const [commentList, setCommentList] = React.useState<ArticleComment[]>([]);
  const [commentTextbox, setCommentTextbox] = React.useState("");
  const { user, detect401 } = useAuth();

  React.useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(`/articles/${slug}/comments`);
        setCommentList(response.data.comments.reverse());
      } catch (e: unknown) {
        detect401(e);
        console.error(e);
      }
    })();
  }, []);

  function handleCommentTextboxChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setCommentTextbox(e.target.value.slice(0, MAX_COMMENT_LENGTH));
  }

  async function handleCommentDelete(e: React.MouseEvent<HTMLElement>, id: number): Promise<void> {
    try {
        await axiosInstance.delete(`articles/${slug}/comments/${id}`);
        setCommentList(commentList.filter((comment) => comment.id != id));
    } catch (e: unknown) {
        detect401(e);
        console.error(e);
    }
  }

  async function handleCommentSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (commentTextbox.length < MIN_COMMENT_LENGTH) return;
    try {
      const response = await axiosInstance.post(`articles/${slug}/comments`, { comment: { body: commentTextbox } });
      setCommentList([response.data.comment, ...commentList]);
      setCommentTextbox("");
    } catch (e: unknown) {
      detect401(e);
      console.error(e);
    }
  }

  return (
    <>
      <div className="row">
        <div className="col-xs-12 col-md-8 offset-md-2">
          <form className="card comment-form" onSubmit={handleCommentSubmit}>
            <div className="card-block">
              <textarea
                className="form-control"
                placeholder="Write a comment..."
                rows={3}
                value={commentTextbox}
                onChange={handleCommentTextboxChange}
              />
            </div>
            <div className="card-footer">
              {user && <img src={user.image === "" ? phimg : user.image} className="comment-author-img" />}
              <button className="btn btn-sm btn-primary" disabled={!user}>Post Comment</button>
            </div>
          </form>

          {commentList.map(comment => (
            <div className="card" key={comment.id}>
              <div className="card-block">
                <p className="card-text">{comment.body}</p>
              </div>
              <div className="card-footer">
                <a href={`/#/profile/${comment.author.username}`} className="comment-author">
                  <img src={comment.author.image === "" ? phimg : comment.author.image} className="comment-author-img" />
                </a>
                &nbsp;
                <a href={`/#/profile/${comment.author.username}`} className="comment-author">
                  {comment.author.username}
                </a>
                <span className="date-posted">{formatDate(comment.updatedAt)}</span>
                {user?.username === comment.author.username && (
                  <span className="mod-options">
                    {/* <i className="ion-edit" /> */}
                    <i className="ion-trash-a" onClick={(e) => handleCommentDelete(e, comment.id)}/>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CommentSection;
