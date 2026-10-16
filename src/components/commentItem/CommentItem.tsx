import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import CardHead from "../cardHead/CardHead";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useForm, type FieldValues } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import type { Comment, Reply } from "../interface/PostInterface";

export default function CommentItem({
  comment,
  postId,
}: {
  comment: Comment;
  postId: string;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const userToken = localStorage.getItem("userToken");
  const { userId } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm();

  const likesList = comment?.likes || [];
  const isLiked = likesList.includes(userId);

  const { data: repliesData, isLoading: repliesLoading } = useQuery({
    queryKey: ["getCommentReplies", comment._id],
    queryFn: async () => {
      return await axios.get(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`,
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
    },
    enabled: showReplies,
  });

  const replies: Reply[] = repliesData?.data?.data?.replies || [];

  const { mutate: createReply, isPending: isCreatingReply } = useMutation({
    mutationFn: async (values: FieldValues) => {
      return await axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`,
        { content: values.content },
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
    },
    onSuccess: () => {
      reset();
      setIsReplying(false);
      setShowReplies(true);
      queryClient.invalidateQueries({
        queryKey: ["getCommentReplies", comment._id],
      });
    },
    onError: (error) => {
      console.log("Error creating reply:", error);
    },
  });

  const { mutate: toggleCommentLike, isPending: isLikingComment } = useMutation({
    mutationFn: async () => {
      return await axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllComments", postId] });
    },
    onError: (error) => {
      console.log("Error toggling like:", error);
    },
  });

  return (
    <div className='flex flex-col w-full mb-2'>
      <div className='flex flex-col gap-1 bg-[#f0f2f5] p-3 rounded-2xl w-full'>
        <CardHead
          name={comment?.commentCreator?.name}
          photo={comment?.commentCreator?.photo || ""}
          createdAt={comment?.createdAt}
          commentUserId={comment?.commentCreator?._id}
          commentId={comment?._id}
          postId={postId}
          isCommentDelete={true}
          content={comment?.content}
          isComment={true}
        />

        <p className='self-start ms-11 text-[#1c1e21] text-xs font-normal'>
          {comment?.content}
        </p>

        {comment?.image && (
          <img
            className='max-w-xs mx-auto mt-2 rounded-lg object-cover'
            src={comment?.image}
            alt='comment attachment'
          />
        )}

        <div className='ms-11 mt-2 flex items-center gap-4 text-xs font-semibold text-[#65676b]'>
          <Button
            size='sm'
            variant='light'
            className='text-xs text-[#1877f2] font-semibold p-0 h-auto min-w-0 bg-transparent'
            onPress={() => setShowReplies(!showReplies)}
          >
            {showReplies ? "Hide Replies" : "View Replies"}
          </Button>

          <Button
            size='sm'
            variant='light'
            className='text-xs text-[#65676b] hover:text-[#1c1e21] font-semibold p-0 h-auto min-w-0 bg-transparent'
            onPress={() => setIsReplying(!isReplying)}
          >
            Reply
          </Button>

          <Button
            size='sm'
            variant='light'
            isLoading={isLikingComment}
            className={`text-xs font-semibold p-0 h-auto min-w-0 flex items-center gap-1 bg-transparent ${
              isLiked ? "text-[#1877f2]" : "text-[#65676b] hover:text-[#1c1e21]"
            }`}
            onPress={() => toggleCommentLike()}
          >
            <span>
              {isLiked ? (
                <i className='fa-solid fa-thumbs-up'></i>
              ) : (
                <i className='fa-regular fa-thumbs-up'></i>
              )}
            </span>
            <span>{comment?.likes?.length ?? 0}</span>
          </Button>
        </div>
      </div>

      {isReplying && (
        <form
          onSubmit={handleSubmit((values) => createReply(values))}
          className='ms-11 mt-2 flex gap-2 items-center'
        >
          <Input
            size='sm'
            placeholder='Write a reply...'
            {...register("content", { required: true })}
            className='max-w-md'
            classNames={{
              inputWrapper: "border border-[#e4e6ea] bg-white",
            }}
          />
          <Button
            size='sm'
            color='primary'
            type='submit'
            isLoading={isCreatingReply}
            className='font-bold'
          >
            Send
          </Button>
        </form>
      )}

      {showReplies && (
        <div className='ms-11 mt-2 flex flex-col gap-2 border-l-2 border-[#e4e6ea] ps-3'>
          {repliesLoading && (
            <p className='text-xs text-[#8a8d91]'>Loading replies...</p>
          )}

          {!repliesLoading && replies.length === 0 && (
            <p className='text-xs text-[#8a8d91]'>No replies for this comment yet.</p>
          )}

          {replies?.map((reply: Reply) => (
            <div
              key={reply._id}
              className='flex flex-col gap-1 bg-white border border-[#e4e6ea] p-2.5 rounded-xl shadow-2xs'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <img
                    src={
                      reply?.commentCreator?.photo ||
                      "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                    }
                    className='w-6 h-6 rounded-full object-cover border border-[#e4e6ea]'
                    alt='reply user'
                  />
                  <span className='text-xs font-bold text-[#1c1e21]'>
                    {reply?.commentCreator?.name}
                  </span>
                </div>
                <span className='text-[10px] text-[#8a8d91]'>
                  {reply?.createdAt?.slice(0, 10)}
                </span>
              </div>
              <p className='text-xs text-[#1c1e21] ms-8'>{reply?.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}