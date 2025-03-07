import { useAuth } from "contexts/AuthContext";
import { axiosInstance } from "utils/axiosInstance";
import React from "react";
import { useState } from "react";
import { validateImage } from "utils/settingValidation";

export default function Settings() {
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string | undefined>();
  const { user, setUser, logout, detect401 } = useAuth();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateFail, setUpdateFail] = useState(false);

  React.useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio);
      setEmail(user.email);
      setImage(user.image);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setImage(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setBio(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // maybe check email validity
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // check password validity
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateFail(false);
    
    if (image !== "" && !validateImage(image)) {
      setUpdateFail(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("token null");
      await axiosInstance.put("/user", {
        user: {
          email: email,
          token: localStorage.getItem("token"),
          username: username,
          bio: bio,
          image: image,
        },
      });

      setUser({
        email,
        username,
        bio,
        image,
      });

      setUpdateSuccess(true);
    } catch (e) {
      detect401(e);
      console.error(e);
      setUpdateFail(true);
      if (e instanceof Error && e.message === "token null") {
        logout();
      }
    }
  };

  return (
    <>
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

              {updateSuccess && <p className="alert alert-success"><strong>Successfully</strong> Update setting</p>}
              {updateFail && 
              <p className="alert alert-danger">
                Setting update <strong>Fail</strong>. Please check the validity of email, username, and image
              </p>}

              <form onSubmit={handleSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="URL of profile picture"
                      value={image}
                      onChange={handleImageChange}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Your Name"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control form-control-lg"
                      rows={8}
                      placeholder="Short bio about you"
                      value={bio}
                      onChange={handleBioChange}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </fieldset>
                  <button className="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
                </fieldset>
              </form>
              <hr />
              <a className="btn btn-outline-danger" href="/#/logout">
                Or click here to logout.
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
