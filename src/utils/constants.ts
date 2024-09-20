// strapi URLs
export const strapi = {
  BASE_URL: import.meta.env.STRAPI_BASE_URL,
  SIGNUP_URL: import.meta.env.STRAPI_BASE_URL + "/api/auth/local/register",
  LOGIN_URL: import.meta.env.STRAPI_BASE_URL + "/api/auth/local/",
};

// App routes
export const routes = {
  HOME: "/",
  PRODUCTS: "/products",
  CART: "/user/cart",
  SIGNUP: "/signup",
  LOGIN: "/login",
  LOGOUT: "/logout",
};

// Placeholders
export const placeholders = {
  PRODUCT_IMAGE:
    "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg",
};
