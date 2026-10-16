import axios from "axios";
import { useParams } from "react-router";
import { Avatar } from "@heroui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IPost } from "../interface/PostInterface";
import PostCard from "../postCard/PostCard";
import { Button } from "@heroui/button";
import LoaderScreen from "../loaderScreen/LoaderScreen";
import { Helmet } from "react-helmet-async";

export default function UsersProfile() {
  const { userId } = useParams();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["getUserProfile", userId],
    queryFn: async () => {
      return await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
    },
    enabled: !!userId,
  });

  const { data: userPosts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["getProfilePosts", userId],
    queryFn: async () => {
      return await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
    },
    enabled: !!userId,
  });

  const { mutate: toggleFollow, isPending: isFollowPending } = useMutation({
    mutationFn: async () => {
      return await axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["getFollowSuggestions"] });
      queryClient.invalidateQueries({ queryKey: ["getAllFeedPostsInfinite"] });
    },
  });

  const user = profileData?.data?.data?.user;
  const isFollowing: boolean = profileData?.data?.data?.isFollowing ?? false;
  const userDataPosts: IPost[] = userPosts?.data?.data?.posts ?? [];
  const userNameProfileKey = user?.name
  if (isProfileLoading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-[#f0f2f5]'>
        <LoaderScreen size={60} />
      </div>
    );
  }

  return (<>
    <Helmet>
      <title>{userNameProfileKey + "'s Profile"}</title>
    </Helmet>
    <div className='bg-[#f0f2f5] min-h-screen pb-12'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='relative w-full h-52 sm:h-72 bg-linear-to-r from-slate-200 to-slate-300 rounded-b-2xl overflow-hidden shadow-sm'>
          {user?.cover ? (
            <img
              src={user.cover}
              alt='User Cover'
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-slate-400'>
              <i className='fa-regular fa-image text-4xl'></i>
            </div>
          )}
        </div>

        <div className='mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between px-4'>
          <div className='relative flex items-end gap-4 -mt-16 sm:-mt-20'>
            <Avatar
              isBordered
              className='w-32 h-32 sm:w-40 sm:h-40 border-4 border-white shadow-lg bg-white'
              src={
                user?.photo ||
                "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
              }
            />

            <div className='pb-2'>
              <h1 className='text-2xl sm:text-3xl text-[#1c1e21] font-black'>
                {user?.name}
              </h1>
              <p className='text-[#65676b] text-sm font-semibold'>
                @{user?.username}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto'>
            <Button
              color={isFollowing ? "default" : "primary"}
              variant={isFollowing ? "flat" : "solid"}
              className='font-bold text-xs px-5'
              isLoading={isFollowPending}
              onPress={() => toggleFollow()}
            >
              {isFollowing ? (
                <>
                  <i className='fa-solid fa-user-check mr-1'></i> Following
                </>
              ) : (
                <>
                  <i className='fa-solid fa-user-plus mr-1'></i> Follow
                </>
              )}
            </Button>

            <div className='grid grid-cols-3 gap-2 flex-1 sm:flex-initial'>
              <div className='rounded-xl border border-[#e4e6ea] bg-white text-center py-2 px-3 shadow-xs'>
                <p className='uppercase text-[#65676b] font-bold text-[10px] tracking-wider'>
                  Followers
                </p>
                <p className='text-[#1c1e21] font-black text-base sm:text-lg mt-0.5'>
                  {user?.followersCount ?? 0}
                </p>
              </div>
              <div className='rounded-xl border border-[#e4e6ea] bg-white text-center py-2 px-3 shadow-xs'>
                <p className='uppercase text-[#65676b] font-bold text-[10px] tracking-wider'>
                  Following
                </p>
                <p className='text-[#1c1e21] font-black text-base sm:text-lg mt-0.5'>
                  {user?.followingCount ?? 0}
                </p>
              </div>
              <div className='rounded-xl border border-[#e4e6ea] bg-white text-center py-2 px-3 shadow-xs'>
                <p className='uppercase text-[#65676b] font-bold text-[10px] tracking-wider'>
                  Bookmarks
                </p>
                <p className='text-[#1c1e21] font-black text-base sm:text-lg mt-0.5'>
                  {user?.bookmarksCount ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-5 px-2'>
          <div className='rounded-2xl border border-[#e4e6ea] bg-white p-4 shadow-xs'>
            <h3 className='text-xs font-black uppercase tracking-wider text-[#65676b]'>
              About
            </h3>
            <div className='mt-3 space-y-2.5 text-xs text-[#1c1e21] font-medium'>
              {user?.email && (
                <p className='flex items-center gap-2 text-[#65676b]'>
                  <i className='fa-regular fa-envelope text-[#1877f2] w-4'></i>
                  <span className='text-[#1c1e21] font-semibold'>{user.email}</span>
                </p>
              )}
              <p className='flex items-center gap-2 text-[#65676b]'>
                <i className='fa-solid fa-circle-check text-[#45bd62] w-4'></i>
                <span>Active on Route Posts</span>
              </p>
            </div>
          </div>
        </div>

        <div className='mt-6 flex flex-col gap-4'>
          <h2 className='text-sm font-black uppercase tracking-wider text-[#65676b] px-2'>
            Posts by {user?.name}
          </h2>

          {isPostsLoading ? (
            <div className='flex justify-center py-8'>
              <LoaderScreen size={40} />
            </div>
          ) : userDataPosts.length === 0 ? (
            <div className='bg-white rounded-2xl border border-[#e4e6ea] p-10 text-center shadow-sm'>
              <div className='w-14 h-14 rounded-full bg-[#f0f2f5] mx-auto mb-3 flex items-center justify-center text-[#65676b]'>
                <i className='fa-regular fa-newspaper text-xl'></i>
              </div>
              <h3 className='font-bold text-sm text-[#1c1e21]'>No posts to display</h3>
              <p className='text-xs text-[#65676b] mt-0.5'>
                This user hasn&apos;t shared any posts yet.
              </p>
            </div>
          ) : (
            userDataPosts.map((post: IPost) => (
              <PostCard post={post} key={post.id || post._id} />
            ))
          )}
        </div>
      </div>
    </div>
  </>

  );
}