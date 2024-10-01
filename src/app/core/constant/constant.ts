const apiUrl = 'http://localhost:4000/api';

export const ApiEndpoint = {
  Auth: {
    Register: `${apiUrl}/users/register`,
    Login: `${apiUrl}/users/login`,
    UserDetail: `${apiUrl}/users/me`,
    GetAllUsers: `${apiUrl}/users/getAllUsers`,
    UpdateIsAdmin: `${apiUrl}/users/updateIsAdmin`,
  },
  Post: {
    CreatePost: `${apiUrl}/posts/create`,
    GetAllPosts: `${apiUrl}/posts/getAllPosts`,
    GetPostById: `${apiUrl}/posts/getPost`,
    UpdatePost: `${apiUrl}/posts/updatePost`,
    DeletePost: `${apiUrl}/posts/deletePost`,
    SearchPost: `${apiUrl}/posts/search`,
  },
};
export const LocalStorage = {
  token: 'USER_TOKEN',
};
