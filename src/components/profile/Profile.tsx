import { Avatar } from "@heroui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { IPost } from "../interface/PostInterface";
import PostCard from "../postCard/PostCard";
import { Input } from "@heroui/input";
import LoaderScreen from "../loaderScreen/LoaderScreen";
import { Helmet } from "react-helmet"

export default function Profile() {
  const useQueryObj = useQueryClient();

  const getProfile = async () => {
    return await axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  };

  const { data: userdata, isLoading: isProfileLoading } = useQuery({
    queryKey: ["getProfile"],
    queryFn: getProfile,
  });

  const user = userdata?.data?.data?.user;
  const userId = user?._id;

  const getProfilePosts = async () => {
    return await axios.get(
      `https://route-posts.routemisr.com/users/${userId}/posts`,
      {
        headers: {
          AUTHORIZATION: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const { data: userPostsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ["getProfilePosts", userId],
    queryFn: getProfilePosts,
    enabled: !!userId,
  });

  const handleProfileImage = async (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);

    return await axios.put(
      `https://route-posts.routemisr.com/users/upload-photo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const { mutate: mutatePhoto, isPending: isUploadingPhoto } = useMutation({
    mutationFn: handleProfileImage,
    onSuccess: () => {
      useQueryObj.invalidateQueries({ queryKey: ["getProfile"] });
      useQueryObj.invalidateQueries({ queryKey: ["getProfiledetails"] });
      useQueryObj.invalidateQueries({ queryKey: ["getProfilePosts", userId] });
      useQueryObj.invalidateQueries({ queryKey: ["getAllPostsInfinite"] });
      useQueryObj.invalidateQueries({ queryKey: ["getAllFeedPostsInfinite"] });
    },
  });

  const handleCoverImage = async (file: File) => {
    const formData = new FormData();
    formData.append("cover", file);

    return await axios.put(
      `https://route-posts.routemisr.com/users/upload-cover`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const { mutate: mutateCover, isPending: isUploadingCover } = useMutation({
    mutationFn: handleCoverImage,
    onSuccess: () => {
      useQueryObj.invalidateQueries({ queryKey: ["getProfile"] });
      useQueryObj.invalidateQueries({ queryKey: ["getProfiledetails"] });
    },
  });

  const userPosts: IPost[] = userPostsData?.data?.data?.posts ?? [];

  if (isProfileLoading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-[#f0f2f5]'>
        <LoaderScreen size={60} />
      </div>
    );
  }

  return (<>
    <Helmet>
      <title>{user?.name}'s Profile</title>
    </Helmet>
    <div className='bg-[#f0f2f5] min-h-screen pb-12'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='relative w-full h-52 sm:h-72 bg-linear-to-r from-slate-200 to-slate-300 rounded-b-2xl overflow-hidden shadow-sm'>
          {user?.cover ? (
            <img
              src={user.cover}
              alt='Profile Cover'
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-slate-400'>
              <i className='fa-regular fa-image text-4xl'></i>
            </div>
          )}
          <label className='absolute bottom-3 right-3 flex items-center gap-2 cursor-pointer bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition'>
            <i className={`fa-solid ${isUploadingCover ? "fa-spinner fa-spin" : "fa-camera"}`}></i>
            <span>{isUploadingCover ? "Uploading..." : "Edit Cover"}</span>
            <Input
              className='hidden'
              type='file'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) mutateCover(file);
              }}
            />
          </label>
        </div>

        <div className='mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between px-4'>
          <div className='relative flex items-end gap-4 -mt-16 sm:-mt-20'>
            <div className='relative'>
              <Avatar
                isBordered
                className='w-32 h-32 sm:w-40 sm:h-40 border-4 border-white shadow-lg bg-white'
                src={
                  user?.photo ||
                  "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                }
              />
              <label className='absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-md transition'>
                <i className={`fa-solid text-xs ${isUploadingPhoto ? "fa-spinner fa-spin" : "fa-camera"}`}></i>
                <Input
                  className='hidden'
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) mutatePhoto(file);
                  }}
                />
              </label>
            </div>

            <div className='pb-2'>
              <h1 className='text-2xl sm:text-3xl text-[#1c1e21] font-black'>
                {user?.name}
              </h1>
              <p className='text-[#65676b] text-sm font-semibold'>
                @{user?.username}
              </p>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-2 w-full sm:w-auto'>
            <div className='rounded-xl border border-[#e4e6ea] bg-white text-center py-2.5 px-4 shadow-xs'>
              <p className='uppercase text-[#65676b] font-bold text-[10px] tracking-wider'>
                Followers
              </p>
              <p className='text-[#1c1e21] font-black text-lg sm:text-2xl mt-0.5'>
                {user?.followersCount ?? 0}
              </p>
            </div>
            <div className='rounded-xl border border-[#e4e6ea] bg-white text-center py-2.5 px-4 shadow-xs'>
              <p className='uppercase text-[#65676b] font-bold text-[10px] tracking-wider'>
                Following
              </p>
              <p className='text-[#1c1e21] font-black text-lg sm:text-2xl mt-0.5'>
                {user?.followingCount ?? 0}
              </p>
            </div>
            <div className='rounded-xl border border-[#e4e6ea] bg-white text-center py-2.5 px-4 shadow-xs'>
              <p className='uppercase text-[#65676b] font-bold text-[10px] tracking-wider'>
                Bookmarks
              </p>
              <p className='text-[#1c1e21] font-black text-lg sm:text-2xl mt-0.5'>
                {user?.bookmarksCount ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className='mt-5 grid gap-4 sm:grid-cols-[1.4fr_.6fr] px-2'>
          <div className='rounded-2xl border border-[#e4e6ea] bg-white p-4 shadow-xs'>
            <h3 className='text-xs font-black uppercase tracking-wider text-[#65676b]'>
              About
            </h3>
            <div className='mt-3 space-y-2.5 text-xs text-[#1c1e21] font-medium'>
              <p className='flex items-center gap-2 text-[#65676b]'>
                <i className='fa-regular fa-envelope text-[#1877f2] w-4'></i>
                <span className='text-[#1c1e21] font-semibold'>{user?.email}</span>
              </p>
              <p className='flex items-center gap-2 text-[#65676b]'>
                <i className='fa-solid fa-circle-check text-[#45bd62] w-4'></i>
                <span>Active on Route Posts</span>
              </p>
            </div>
          </div>

          <div className='rounded-2xl border border-[#dbeafe] bg-[#f6faff] p-4 shadow-xs flex flex-col justify-center'>
            <p className='text-[10px] font-extrabold uppercase tracking-wider text-[#1f4f96]'>
              Total Posts
            </p>
            <p className='mt-1 text-2xl font-black text-[#1c1e21]'>
              {userPostsData?.data?.meta?.pagination?.total ?? userPosts.length}
            </p>
          </div>
        </div>

        <div className='mt-6 flex flex-col gap-4'>
          <h2 className='text-sm font-black uppercase tracking-wider text-[#65676b] px-2'>
            Posts
          </h2>

          {isPostsLoading ? (
            <div className='flex justify-center py-8'>
              <LoaderScreen size={40} />
            </div>
          ) : userPosts.length === 0 ? (
            <div className='bg-white rounded-2xl border border-[#e4e6ea] p-10 text-center shadow-sm'>
              <div className='w-14 h-14 rounded-full bg-[#f0f2f5] mx-auto mb-3 flex items-center justify-center text-[#65676b]'>
                <i className='fa-regular fa-pen-to-square text-xl'></i>
              </div>
              <h3 className='font-bold text-sm text-[#1c1e21]'>No posts published yet</h3>
              <p className='text-xs text-[#65676b] mt-0.5'>
                Posts you create will show up here on your profile.
              </p>
            </div>
          ) : (
            userPosts.map((post: IPost) => (
              <PostCard post={post} key={post.id || post._id} />
            ))
          )}
        </div>
      </div>
    </div>
  </>);
}