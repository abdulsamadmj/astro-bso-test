import { placeholders, strapi } from "../../utils/constants";
import type { Product } from "../../utils/interfaces";

interface ProductsResponse {
  products: Product[];
  fetchError: string | null;
}

export const getProducts = async (): Promise<ProductsResponse> => {
  let products: Product[] = [];
  let fetchError: string | null = null;
  try {
    // Fetch products from Strapi API
    const response = await fetch(strapi.BASE_URL + "/api/products?populate=*", {
      method: "get",
    });
    const res = await response.json();

    if (response.ok) {
      // Check if any products are returned
      products = res.data.map((item: any) => {
        const image = item.attributes.image?.data?.[0]?.attributes?.url;
        return {
          pID: item.attributes.pID,
          title: item.attributes.title,
          image: image ? strapi.BASE_URL + image : placeholders.PRODUCT_IMAGE,
          price: item.attributes.price,
        };
      });
      return {
        products,
        fetchError,
      };
    } else {
      fetchError = "Failed to fetch products";
    }
    return {
      products,
      fetchError,
    };
  } catch (error: any) {
    return {
      products,
      fetchError: error.message ?? "An unexpected error occurred.",
    };
  }
};
