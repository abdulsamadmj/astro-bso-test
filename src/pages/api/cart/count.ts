import { strapi } from "../../../utils/constants";

interface CartCountResponse {
  count: number;
  error: string | null;
}

export const getCartCount = async (
  token: string
): Promise<CartCountResponse> => {
  try {
    // Make a request to the Strapi API to get the product count from the cart
    const strapiRes = await fetch(
      strapi.BASE_URL + "/api/users/me/cart-count",
      {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!strapiRes.ok) {
      return {
        count: 0,
        error: "Failed to fetch cart count",
      };
    }
    const data = await strapiRes.json();

    return {
      count: data.cartCount,
      error: null,
    };
  } catch (error: any) {
    console.error("Error getting cart count:", error);
    return {
      count: 0,
      error,
    };
  }
};
