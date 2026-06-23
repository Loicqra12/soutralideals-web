import apiClient from "./client";
import type { Cart } from "@/types/cart";

export async function fetchCart(userId: string): Promise<Cart> {
  const { data } = await apiClient.get<Cart>(`/cart/user/${userId}`);
  return data;
}

export async function addToCart(payload: {
  userId: string;
  articleId: string;
  vendeurId: string;
  quantite?: number;
}): Promise<Cart> {
  const { data } = await apiClient.post<{ cart: Cart }>("/cart/add", {
    userId: payload.userId,
    articleId: payload.articleId,
    vendeurId: payload.vendeurId,
    quantite: payload.quantite ?? 1,
  });
  return data.cart;
}

export async function updateCartItemQuantity(
  userId: string,
  itemId: string,
  quantite: number,
): Promise<Cart> {
  const { data } = await apiClient.put<{ cart: Cart }>(
    `/cart/user/${userId}/item/${itemId}`,
    { quantite },
  );
  return data.cart;
}

export async function removeCartItem(
  userId: string,
  itemId: string,
): Promise<Cart> {
  const { data } = await apiClient.delete<{ cart: Cart }>(
    `/cart/user/${userId}/item/${itemId}`,
  );
  return data.cart;
}

export async function updateCartAddress(
  userId: string,
  address: {
    adresse: string;
    ville: string;
    telephone: string;
    pays?: string;
    codePostal?: string;
  },
): Promise<Cart> {
  const { data } = await apiClient.put<{ cart: Cart }>(
    `/cart/user/${userId}/address`,
    address,
  );
  return data.cart;
}

export async function checkoutCart(
  userId: string,
  payload?: { moyenPaiement?: string; notesClient?: string },
): Promise<{ commande: unknown; cart: Cart }> {
  const { data } = await apiClient.post<{ commande: unknown; cart: Cart }>(
    `/cart/user/${userId}/checkout`,
    payload ?? {},
  );
  return data;
}
