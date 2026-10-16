export interface IPost {
  _id: string;
  body: string;
  image?: string;
  privacy: string;
  user: PostUser;
  sharedPost?: SharedPost | null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment?: Comment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}

export interface PostUser {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  email?: string;
  cover?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
}

export interface SharedPost {
  _id: string;
  body: string;
  image?: string;
  user: PostUser;
}

export interface Comment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment?: string | null;
  likes: string[];
  image?: string;
  createdAt: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo?: string;
}

export interface Reply {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  createdAt: string;
}

export interface Notification {
  _id: string;
  type: "comment_post" | "follow_user" | "share_post" | "like_post" | string;
  isRead: boolean;
  createdAt: string;
  actor: {
    _id: string;
    name: string;
    photo?: string;
  };
  entity?: {
    id: string;
    [key: string]: unknown;
  };
}

export interface SuggestionUser {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  followersCount?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
