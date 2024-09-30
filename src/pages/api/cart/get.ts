import { strapi } from "../../../utils/constants";
import type { Product } from "../../../utils/interfaces";

interface CartResponse {
  products: Product[];
  error?: string | null;
}

export const getCartProducts = async (token: string): Promise<CartResponse> => {
  try {
    // Make a request to the Strapi API to get the products list from cart
    const strapiRes = await fetch(strapi.BASE_URL + "/api/users/me/cart", {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!strapiRes.ok) {
      return { products: [], error: "Failed to fetch cart count" };
    }
    const data = await strapiRes.json();
    return {
      products: data,
    };
  } catch (error: any) {
    console.error("Error getting cart count:", error);
    return {
      products: [],
      error,
    };
  }
};
