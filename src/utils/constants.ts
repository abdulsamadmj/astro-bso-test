export const strapi = {
  BASE_URL: import.meta.env.STRAPI_BASE_URL,
  SIGNUP_URL: import.meta.env.STRAPI_BASE_URL + "/api/auth/local/register",
  LOGIN_URL: import.meta.env.STRAPI_BASE_URL + "/api/auth/local/",
};
export const routes = {
  HOME: "/",
  PRODUCTS: "/products",
  CART: "/user/cart",
  SIGNUP: "/signup",
  LOGIN: "/login",
  LOGOUT: "/logout",
};
