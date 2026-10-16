import axios from "axios";
import { useState, useEffect, useRef } from "react";
import type { IPost } from "../interface/PostInterface";
import PostCard from "../postCard/PostCard";
import LoaderScreen from "../loaderScreen/LoaderScreen";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/react";
import CreatePost from "../createPost/CreatePost";
import SuggestionItem from "../suggestionItem/SuggestionItem";
import type { SuggestionUser } from "../interface/PostInterface";
import { Helmet } from "react-helmet-async";

type FeedType = "All Posts" | "Following" | "Bookmark";

export default function Home() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [feedType, setFeedType] = useState<FeedType>("All Posts");

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const userToken = localStorage.getItem("userToken");
  const headers = { AUTHORIZATION: `Bearer ${userToken}` };

  async function getFollowSuggestions() {
    const res = await axios.get(
      `https://route-posts.routemisr.com/users/suggestions?limit=10`,
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    return res;
  }

  const { data: followDatares } = useQuery({
    queryKey: ["getFollowSuggestions"],
    queryFn: getFollowSuggestions,
  });
  const followData: SuggestionUser[] = followDatares?.data?.data?.suggestions ?? [];

  const {
    data: allPostsData,
    fetchNextPage: fetchNextAll,
    hasNextPage: hasNextAll,
    isFetchingNextPage: isFetchingNextAll,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useInfiniteQuery({
    queryKey: ["getAllPostsInfinite"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get(
        `https://route-posts.routemisr.com/posts?sort=-createdAt&page=${pageParam}&limit=40`,
        { headers }
      );
      return {
        posts: res.data?.data?.posts || res.data?.posts || [],
        page: pageParam
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.posts.length === 40 ? lastPage.page + 1 : undefined;
    },
  });

  const {
    data: feedPostsData,
    fetchNextPage: fetchNextFeed,
    hasNextPage: hasNextFeed,
    isFetchingNextPage: isFetchingNextFeed,
    isLoading: isLoadingFeed,
    isError: isErrorFeed,
  } = useInfiniteQuery({
    queryKey: ["getAllFeedPostsInfinite"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get(
        `https://route-posts.routemisr.com/posts/feed?sort=-createdAt&page=${pageParam}&limit=40`,
        { headers }
      );
      return {
        posts: res.data?.data?.posts || res.data?.posts || [],
        page: pageParam
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.posts.length === 40 ? lastPage.page + 1 : undefined;
    },
  });

  const {
    data: bookPostsData,
    fetchNextPage: fetchNextBook,
    hasNextPage: hasNextBook,
    isFetchingNextPage: isFetchingNextBook,
    isLoading: isLoadingBook,
    isError: isErrorBook,
  } = useInfiniteQuery({
    queryKey: ["getAllBookMarksPostsInfinite"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get(
        `https://route-posts.routemisr.com/users/bookmarks?sort=-createdAt&page=${pageParam}&limit=40`,
        { headers }
      );
      return {
        posts: res.data?.data?.bookmarks || res.data?.bookmarks || [],
        page: pageParam
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.posts.length === 40 ? lastPage.page + 1 : undefined;
    },
  });

  const allPosts = allPostsData?.pages.flatMap((page) => page.posts) ?? [];
  const feedDataPosts = feedPostsData?.pages.flatMap((page) => page.posts) ?? [];
  const bookDataPosts = bookPostsData?.pages.flatMap((page) => page.posts) ?? [];

  const currentPosts =
    feedType === "All Posts"
      ? allPosts
      : feedType === "Following"
        ? feedDataPosts
        : bookDataPosts;

  const isFetchingNext =
    feedType === "All Posts"
      ? isFetchingNextAll
      : feedType === "Following"
        ? isFetchingNextFeed
        : isFetchingNextBook;

  const hasNextPage =
    feedType === "All Posts"
      ? hasNextAll
      : feedType === "Following"
        ? hasNextFeed
        : hasNextBook;

  const fetchNextPage =
    feedType === "All Posts"
      ? fetchNextAll
      : feedType === "Following"
        ? fetchNextFeed
        : fetchNextBook;
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNext) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNext, fetchNextPage]);

  if (isLoadingAll || isLoadingFeed || isLoadingBook) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-[#f0f2f5]'>
        <LoaderScreen size={60} />
      </div>
    );
  }

  if (isErrorAll || isErrorFeed || isErrorBook) {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center gap-4 bg-[#f0f2f5]'>
        <div className='w-16 h-16 rounded-full bg-red-100 flex items-center justify-center'>
          <i className='fa-solid fa-triangle-exclamation text-2xl text-red-500'></i>
        </div>
        <h1 className='text-xl font-bold text-[#1c1e21]'>Something went wrong</h1>
        <p className='text-[#65676b] text-sm'>Please refresh the page and try again.</p>
      </div>
    );
  }

  const navItems: { type: FeedType; icon: string; label: string }[] = [
    { type: "All Posts", icon: "fa-solid fa-earth-americas", label: "All Posts" },
    { type: "Following", icon: "fa-solid fa-user-group", label: "Following" },
    { type: "Bookmark", icon: "fa-solid fa-bookmark", label: "Bookmarks" },
  ];

  return (
    <>
      <Helmet>
        <title>{"Home - " + feedType}</title>
      </Helmet>
      <div className='bg-[#f0f2f5] min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-5'>

            <div className='hidden lg:block lg:col-span-1'>
              <div className='sticky top-20 flex flex-col gap-1 bg-white rounded-2xl border border-[#e4e6ea] p-3 shadow-sm'>
                <h3 className='font-extrabold text-xs text-[#65676b] uppercase tracking-wider px-3 pt-2 pb-1'>
                  Feeds
                </h3>
                {navItems.map((item) => (
                  <button
                    key={item.type}
                    className={`feed-nav-btn ${feedType === item.type ? "active" : ""}`}
                    onClick={() => setFeedType(item.type)}
                  >
                    <i className={`${item.icon} w-5 text-center`}></i>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className='col-span-1 lg:col-span-2 flex flex-col gap-4'>

              <div className='flex gap-2 lg:hidden overflow-x-auto pb-1 scrollbar-none'>
                {navItems.map((item) => (
                  <Button
                    key={item.type}
                    size='sm'
                    className={`shrink-0 font-semibold text-xs rounded-full ${feedType === item.type
                      ? "bg-[#1877f2] text-white"
                      : "bg-white text-[#65676b] border border-[#e4e6ea]"
                      }`}
                    onPress={() => setFeedType(item.type)}
                  >
                    <i className={item.icon}></i>
                    {item.label}
                  </Button>
                ))}
              </div>
              <div
                className='bg-white rounded-2xl border border-[#e4e6ea] p-3 shadow-sm cursor-pointer'
                onClick={onOpen}
              >
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-full bg-[#e4e6ea] flex items-center justify-center shrink-0'>
                    <i className='fa-solid fa-pen text-[#65676b] text-sm'></i>
                  </div>
                  <div className='flex-1 bg-[#f0f2f5] hover:bg-[#e4e6ea] transition-colors rounded-full px-4 py-2 text-sm text-[#65676b] font-medium select-none'>
                    What&apos;s on your mind?
                  </div>
                </div>
              </div>
              <CreatePost
                onClose={onClose}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
              />
              <div className='flex flex-col gap-4'>
                {currentPosts.length === 0 ? (
                  <div className='bg-white rounded-2xl border border-[#e4e6ea] p-10 text-center shadow-sm'>
                    <div className='w-16 h-16 rounded-full bg-[#e7f0fd] mx-auto mb-4 flex items-center justify-center'>
                      <i className='fa-solid fa-newspaper text-2xl text-[#1877f2]'></i>
                    </div>
                    <h3 className='font-bold text-[#1c1e21] mb-1'>No posts yet</h3>
                    <p className='text-sm text-[#65676b]'>
                      {feedType === "All Posts"
                        ? "Be the first to share something!"
                        : feedType === "Following"
                          ? "Follow people to see their posts here."
                          : "Save posts to find them again later."}
                    </p>
                  </div>
                ) : (
                  currentPosts.map((post: IPost) => (
                    <PostCard
                      post={post}
                      key={post.id || post._id}
                      isShearedPost={post.isShare}
                    />
                  ))
                )}
                <div ref={loadMoreRef} className='py-4 flex justify-center items-center h-10'>
                  {isFetchingNext && <LoaderScreen size={30} />}
                </div>
              </div>
            </div>
            <div className='hidden lg:block lg:col-span-1'>
              <div className='sticky top-20 flex flex-col gap-3 bg-white rounded-2xl border border-[#e4e6ea] p-4 shadow-sm'>
                <h3 className='font-extrabold text-xs text-[#65676b] uppercase tracking-wider'>
                  People You May Know
                </h3>
                {followData.length === 0 ? (
                  <p className='text-xs text-[#65676b] text-center py-2'>
                    No suggestions right now.
                  </p>
                ) : (
                  followData.map((suggestedUser) => (
                    <SuggestionItem key={suggestedUser._id} user={suggestedUser} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
}