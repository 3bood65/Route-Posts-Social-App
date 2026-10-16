import { Button } from "@heroui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function LikeBtn({
  postId,
  isLiked,
}: {
  postId: string;
  isLiked: boolean;
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getAllFeedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getPostDetails", postId] });
    },
  });

  return (
    <Button
      className={`bg-transparent p-0 m-0 min-w-0 transition-transform active:scale-90 ${
        isLiked ? "text-[#1877f2]" : "text-[#65676b] hover:text-[#1c1e21]"
      }`}
      isIconOnly
      size='sm'
      isLoading={isPending}
      onPress={() => mutate()}
      aria-label={isLiked ? "Unlike post" : "Like post"}
    >
      {isLiked ? (
        <i className='fa-solid fa-thumbs-up text-sm'></i>
      ) : (
        <i className='fa-regular fa-thumbs-up text-sm'></i>
      )}
    </Button>
  );
}
