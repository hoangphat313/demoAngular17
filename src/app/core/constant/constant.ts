const apiUrl = 'http://localhost:4000/api';
export const fixedAdmin = '66fbb72e809b8fce685e6695';
export const ApiEndpoint = {
  Auth: {
    Register: `${apiUrl}/users/register`,
    Login: `${apiUrl}/users/login`,
    UserDetail: `${apiUrl}/users/getUserDetail`,
    GetAllUsers: `${apiUrl}/users/getAllUsers`,
    UpdateIsAdmin: `${apiUrl}/users/updateIsAdmin`,
    SearchUser: `${apiUrl}/users/searchUser`,
    DeleteUser: `${apiUrl}/users/deleteUser`,
    UpdateUserDetail: `${apiUrl}/users/updateUserDetail`,
  },
  Post: {
    CreatePost: `${apiUrl}/posts/create`,
    GetAllPosts: `${apiUrl}/posts/getAllPosts`,
    GetPostById: `${apiUrl}/posts/getPost`,
    UpdatePost: `${apiUrl}/posts/updatePost`,
    DeletePost: `${apiUrl}/posts/deletePost`,
    SearchPost: `${apiUrl}/posts/search`,
    UpdateFeaturedPost: `${apiUrl}/posts/featured`,
  },
};
export const LocalStorage = {
  token: 'USER_TOKEN',
};
