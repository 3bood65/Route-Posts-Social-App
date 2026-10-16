import { Button } from "@heroui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import type { SuggestionUser } from "../interface/PostInterface";
import { Link } from "react-router-dom";

export default function SuggestionItem({ user }: { user: SuggestionUser }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const queryClient = useQueryClient();

  async function toggleFollowBtn() {
    return await axios.put(
      `https://route-posts.routemisr.com/users/${user._id}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: toggleFollowBtn,
    onSuccess: () => {
      setIsFollowing(!isFollowing);
      queryClient.invalidateQueries({ queryKey: ["toggleFollowBtn"] });
      queryClient.invalidateQueries({ queryKey: ["getFollowSuggestions"] });
      queryClient.invalidateQueries({ queryKey: ["getAllFeedPosts"] });
    },
    onError: (error) => {
      console.log("Follow Error:", error);
    },
  });

  return (
    <div className='flex items-center justify-between gap-2 py-1'>
      <Link
        to={`/user/${user._id}/profile`}
        className='flex items-center gap-2.5 min-w-0 hover:opacity-80 transition'
      >
        <img
          src={
            user?.photo ||
            "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
          }
          className='w-9 h-9 rounded-full object-cover shrink-0 border border-[#e4e6ea]'
          alt={user?.name || "User"}
        />
        <div className='flex flex-col min-w-0'>
          <span className='text-xs font-bold text-[#1c1e21] truncate hover:underline'>
            {user?.name}
          </span>
          <span className='text-[11px] text-[#65676b] truncate'>
            @{user?.username}
          </span>
        </div>
      </Link>

      <Button
        size='sm'
        variant={isFollowing ? "flat" : "solid"}
        className={`font-bold text-xs h-7 px-3 shrink-0 ${
          isFollowing ? "bg-[#f0f2f5] text-[#1c1e21]" : "bg-[#1877f2] text-white"
        }`}
        onPress={() => mutate()}
        isLoading={isPending}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}