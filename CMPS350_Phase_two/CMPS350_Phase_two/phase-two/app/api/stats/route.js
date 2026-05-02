import { NextResponse } from "next/server";
import {
  getAvgFollowerPerUser,
  getAvgFollowingPerUser,
  getAvgPostsPerUser,
  getMostActiveUser,
  getMostLikedPost,
  getMostCommentedPost
} from "@/repos/stats";

export async function GET(request) {
  const avgFollowers = await getAvgFollowerPerUser();
  const avgFollowing = await getAvgFollowingPerUser();
  const avgPosts = await getAvgPostsPerUser();
  const mostActiveUser = await getMostActiveUser();
  const mostLikedPost = await getMostLikedPost();
  const mostCommentedPost = await getMostCommentedPost();

  const errors = [
    avgFollowers,
    avgFollowing,
    avgPosts,
    mostActiveUser,
    mostLikedPost,
    mostCommentedPost
  ];

  const error = errors.find((res) => res.error);

  if (error) {
    return NextResponse.json(error.error, {
      status: error.error.status || 500
    });
  }

  return NextResponse.json({
    avgFollowers: avgFollowers.data,
    avgFollowing: avgFollowing.data,
    avgPosts: avgPosts.data,
    mostActiveUser: mostActiveUser.data,
    mostLikedPost: mostLikedPost.data,
    mostCommentedPost: mostCommentedPost.data
  });
}