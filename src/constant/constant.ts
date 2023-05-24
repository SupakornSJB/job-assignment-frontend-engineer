// Article
export const MAX_TITLE_LENGTH = 9999;
export const MAX_ABOUT_LENGTH = 9999;
export const MAX_ARTICLE_LENGTH = 9999;
export const MAX_TAGS_LENGTH = 9999;

// Profile and Setting
export const MAX_USERNAME_LENGTH = 25;
export const MAX_PASSWORD_LENGTH = 32;
export const MAX_BIO_LENGTH = 500;
export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export const validateImage = (link: string) => {
    return true;
}
