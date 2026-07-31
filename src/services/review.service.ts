import api from "@/lib/axios";
import type { ApiResponse, CreateReviewData, Review } from "@/types";

export const reviewService = {
  create: async (reviewData: CreateReviewData): Promise<Review> => {
    const { data } = await api.post<ApiResponse<Review>>("/reviews", reviewData);
    if (!data.data) throw new Error(data.message || "Failed to submit review");
    return data.data;
  },
};
