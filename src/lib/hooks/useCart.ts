"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  checkoutCart,
  fetchCart,
  removeCartItem,
  updateCartAddress,
  updateCartItemQuantity,
} from "@/lib/api/cart";
import { useAuthStore } from "@/stores";

export function useCart() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const userId = utilisateur?._id;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => fetchCart(userId!),
    enabled: !!userId,
    staleTime: 30 * 1000,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["cart", userId] });

  const addItem = useMutation({
    mutationFn: (payload: {
      articleId: string;
      vendeurId: string;
      quantite?: number;
    }) =>
      addToCart({
        userId: userId!,
        articleId: payload.articleId,
        vendeurId: payload.vendeurId,
        quantite: payload.quantite,
      }),
    onSuccess: invalidate,
  });

  const updateQuantity = useMutation({
    mutationFn: ({ itemId, quantite }: { itemId: string; quantite: number }) =>
      updateCartItemQuantity(userId!, itemId, quantite),
    onSuccess: invalidate,
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) => removeCartItem(userId!, itemId),
    onSuccess: invalidate,
  });

  const setAddress = useMutation({
    mutationFn: (address: {
      adresse: string;
      ville: string;
      telephone: string;
      pays?: string;
    }) => updateCartAddress(userId!, address),
    onSuccess: invalidate,
  });

  const checkout = useMutation({
    mutationFn: (payload?: { moyenPaiement?: string; notesClient?: string }) =>
      checkoutCart(userId!, payload),
    onSuccess: invalidate,
  });

  const itemCount =
    query.data?.articles?.reduce((sum, item) => sum + (item.quantite ?? 0), 0) ??
    0;

  return {
    cart: query.data,
    isLoading: query.isLoading,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    setAddress,
    checkout,
  };
}
