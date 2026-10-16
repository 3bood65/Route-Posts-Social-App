import { useParams } from "react-router";
import PostCard from "../postCard/PostCard";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoaderScreen from "../loaderScreen/LoaderScreen";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@heroui/react";
import { useState } from "react";

export default function PostDetails() {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [shareText, setShareText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  async function getPostDetails() {
    return await axios.get(`https://route-posts.routemisr.com/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const {
    data: PostDetails,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["getPostDetails", postId],
    queryFn: getPostDetails,
    enabled: !!postId,
  });

  async function getAllComments() {
    return await axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data: allCommentsData } = useQuery({
    queryKey: ["getAllComments", postId],
    queryFn: getAllComments,
    enabled: !!postId,
  });

  const { mutate: handleShare, isPending: isSharing, error: shareError } = useMutation({
    mutationFn: async () => {
      return await axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/share`,
        shareText.trim() ? { body: shareText.trim() } : {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPostsInfinite"] });
      queryClient.invalidateQueries({ queryKey: ["getAllFeedPostsInfinite"] });
      queryClient.invalidateQueries({ queryKey: ["getProfilePosts"] });
      setShareText("");
      onClose();
    },
  });

  function copyPostLink() {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-[#f0f2f5]'>
        <LoaderScreen size={60} />
      </div>
    );
  }

  if (isError || !PostDetails?.data?.data?.post) {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center gap-3 bg-[#f0f2f5] px-4'>
        <div className='w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500'>
          <i className='fa-solid fa-triangle-exclamation text-2xl'></i>
        </div>
        <h2 className='text-lg font-bold text-[#1c1e21]'>Post not found</h2>
        <p className='text-xs text-[#65676b] text-center'>
          The post may have been removed or you may not have permission to view it.
        </p>
        <Link
          to='/'
          className='mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white rounded-xl text-xs font-bold hover:bg-[#166fe5] transition'
        >
          <i className='fa-solid fa-arrow-left'></i> Back to Home Feed
        </Link>
      </div>
    );
  }

  const postData = PostDetails?.data?.data.post;
  const commentsArray = allCommentsData?.data?.data?.comments ?? [];

  return (
    <>
      <Helmet>
        <title>
          {postData?.user?.name ? `${postData.user.name}'s Post Details` : "Post Details"} - Route Posts
        </title>
      </Helmet>
      <div className='bg-[#f0f2f5] min-h-screen py-6'>
        <div className='max-w-2xl mx-auto px-4'>
          <div className='mb-3 flex items-center justify-between'>
            <Link
              to='/'
              className='inline-flex items-center gap-1.5 text-xs font-bold text-[#65676b] hover:text-[#1877f2] transition'
            >
              <i className='fa-solid fa-arrow-left'></i>
              <span>Back to feed</span>
            </Link>

            <Button
              size='sm'
              onPress={onOpen}
              className='bg-white border border-[#e4e6ea] text-[#1c1e21] hover:bg-[#f0f2f5] font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 px-3 py-1.5 h-auto transition'
            >
              <i className='fa-solid fa-share-nodes text-[#1877f2] text-xs'></i>
              <span>Share</span>
            </Button>
          </div>

          <PostCard
            post={postData}
            allCommentsData={commentsArray}
            isPageDetails={true}
          />
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        placement='top-center'
        onOpenChange={(open) => {
          if (!open) setShareText("");
          onOpenChange();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col text-center font-bold text-base text-[#1c1e21] border-b border-[#e4e6ea] pb-3'>
                Share Post
              </ModalHeader>
              <ModalBody className='py-4 flex flex-col gap-3'>
                <Input
                  label="Say something about this post (Optional)"
                  placeholder="What are your thoughts?"
                  variant="bordered"
                  value={shareText}
                  onValueChange={setShareText}
                  classNames={{
                    inputWrapper: "border-[#e4e6ea] bg-white",
                  }}
                />

                <div className='flex items-center justify-between p-3 rounded-xl bg-[#f0f2f5] border border-[#e4e6ea]'>
                  <div className='flex items-center gap-2 text-xs font-semibold text-[#65676b]'>
                    <i className='fa-solid fa-link text-[#1877f2]'></i>
                    <span>Share via link</span>
                  </div>
                  <Button
                    size='sm'
                    variant='flat'
                    color={isCopied ? "success" : "default"}
                    className='text-xs font-bold h-7 px-3'
                    onPress={copyPostLink}
                  >
                    <i className={`fa-solid ${isCopied ? "fa-check" : "fa-copy"}`}></i>
                    <span>{isCopied ? "Copied!" : "Copy Link"}</span>
                  </Button>
                </div>

                {shareError && (
                  <p className='text-red-500 text-xs font-semibold'>
                    {axios.isAxiosError(shareError)
                      ? shareError.response?.data?.message || "Failed to share post."
                      : "An error occurred."}
                  </p>
                )}
              </ModalBody>
              <ModalFooter className='border-t border-[#e4e6ea] pt-3'>
                <Button color='danger' variant='flat' size='sm' onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color='primary'
                  size='sm'
                  className='font-bold'
                  isLoading={isSharing}
                  onPress={() => handleShare()}
                >
                  Share Now
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}