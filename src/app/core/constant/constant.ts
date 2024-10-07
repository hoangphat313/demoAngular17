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
  Feedback: {
    AddFeedBack: `${apiUrl}/feedbacks/add`,
    GetAllFeedback: `${apiUrl}/feedbacks/get`,
    UpdateFeedbackStatus: `${apiUrl}/feedbacks/update`,
    DeleteFeedback: `${apiUrl}/feedbacks/delete`,
    SearchFeedback: `${apiUrl}/feedbacks/search`,
  },
  Favourite: {
    AddFavourite: `${apiUrl}/users/addFavourite`,
    RemoveFavourite: `${apiUrl}/users/removeFavourite`,
    GetAllFavourites: `${apiUrl}/users/getFavourite`,
  },
};
export const LocalStorage = {
  token: 'USER_TOKEN',
};
