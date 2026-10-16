import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardBody } from "@heroui/card";
import CardHead from "../cardHead/CardHead";
import { Link } from "react-router";
import { Button } from "@heroui/button";
import { useState } from "react";
import type { Notification } from "../interface/PostInterface";
import LoaderScreen from "../loaderScreen/LoaderScreen";
import { Helmet } from "react-helmet-async";

export default function Notifications() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const queryClient = useQueryClient();

  const getNotifications = async () => {
    const endpoint =
      filter === "unread"
        ? `https://route-posts.routemisr.com/notifications?unread=false`
        : `https://route-posts.routemisr.com/notifications`;

    return await axios.get(endpoint, {
      headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getNotifications", filter],
    queryFn: getNotifications,
  });

  const getUnreadCountNotification = async () => {
    return await axios.get(
      `https://route-posts.routemisr.com/notifications/unread-count`,
      {
        headers: {
          AUTHORIZATION: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const { data: unReadCountData } = useQuery({
    queryKey: ["getUnreadCountNotification"],
    queryFn: getUnreadCountNotification,
  });

  const readOneNotifi = async (id: string) => {
    return await axios.patch(
      `https://route-posts.routemisr.com/notifications/${id}/read`,
      {},
      {
        headers: {
          AUTHORIZATION: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const { mutate: markAsRead, isPending: isReading } = useMutation({
    mutationFn: readOneNotifi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getNotifications"] });
      queryClient.invalidateQueries({
        queryKey: ["getUnreadCountNotification"],
      });
    },
  });

  const readAllNotifi = async () => {
    return await axios.patch(
      `https://route-posts.routemisr.com/notifications/read-all`,
      {},
      {
        headers: {
          AUTHORIZATION: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const { mutate: markAllAsRead, isPending: isAllReading } = useMutation({
    mutationFn: readAllNotifi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getNotifications"] });
      queryClient.invalidateQueries({
        queryKey: ["getUnreadCountNotification"],
      });
    },
  });

  const unreadCount: number = unReadCountData?.data?.data?.unreadCount ?? 0;
  const notificationsArray: Notification[] = data?.data?.data?.notifications ?? [];

  return (<>
    <Helmet>
      <title>Notifications</title>
    </Helmet>
    <div className='bg-[#f0f2f5] min-h-screen py-6'>
      <div className='max-w-3xl mx-auto px-4'>
        <div className='bg-white p-5 rounded-2xl border border-[#e4e6ea] shadow-sm mb-4'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
            <div>
              <h1 className='text-2xl font-black text-[#1c1e21] flex items-center gap-2'>
                <i className='fa-solid fa-bell text-[#1877f2] text-xl'></i>
                Notifications
              </h1>
              <p className='text-xs text-[#65676b] font-medium mt-1'>
                Realtime updates for likes, comments, shares, and follows
              </p>
            </div>
            <Button
              size='sm'
              radius='full'
              color='primary'
              variant='flat'
              className='font-bold text-xs self-start sm:self-auto'
              isLoading={isAllReading}
              isDisabled={unreadCount === 0}
              onPress={() => markAllAsRead()}
            >
              <i className='fa-solid fa-check-double mr-1'></i>
              Mark All As Read
            </Button>
          </div>

          <div className='flex gap-2 pt-2 border-t border-[#e4e6ea]'>
            <Button
              size='sm'
              radius='full'
              className={`font-semibold text-xs ${filter === "all"
                ? "bg-[#1877f2] text-white"
                : "bg-[#f0f2f5] text-[#65676b] hover:bg-[#e4e6ea]"
                }`}
              onPress={() => setFilter("all")}
            >
              All
            </Button>

            <Button
              size='sm'
              radius='full'
              className={`font-semibold text-xs ${filter === "unread"
                ? "bg-[#1877f2] text-white"
                : "bg-[#f0f2f5] text-[#65676b] hover:bg-[#e4e6ea]"
                }`}
              onPress={() => setFilter("unread")}
            >
              {unreadCount > 0 && (
                <span className='w-2 h-2 rounded-full bg-red-500 mr-1'></span>
              )}
              {unreadCount} Unread
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className='flex justify-center py-12'>
            <LoaderScreen size={50} />
          </div>
        )}

        {!isLoading && notificationsArray.length === 0 && (
          <div className='bg-white rounded-2xl border border-[#e4e6ea] p-12 text-center shadow-sm'>
            <div className='w-16 h-16 rounded-full bg-[#e7f0fd] mx-auto mb-3 flex items-center justify-center'>
              <i className='fa-regular fa-bell text-2xl text-[#1877f2]'></i>
            </div>
            <h3 className='font-bold text-base text-[#1c1e21]'>No notifications yet</h3>
            <p className='text-xs text-[#65676b] mt-1'>
              {filter === "unread"
                ? "You have no unread notifications right now."
                : "When someone interacts with your posts, you'll see it here."}
            </p>
          </div>
        )}

        {!isLoading &&
          notificationsArray.map((notifi) => {
            const isUnread = !notifi.isRead;

            return (
              <Card
                key={notifi._id}
                className={`my-2 p-2 rounded-2xl border transition-all ${isUnread
                  ? "bg-[#ebf3fd] border-[#c0dcfd] shadow-sm"
                  : "bg-white border-[#e4e6ea] shadow-xs"
                  }`}
              >
                <CardHead
                  name={notifi?.actor?.name}
                  photo={notifi?.actor?.photo || ""}
                />
                <CardBody className='px-4 py-2'>
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                    <div className='text-sm text-[#1c1e21] pl-2 sm:pl-10'>
                      {notifi.type === "comment_post" && (
                        <span>
                          <Link
                            to={`/user/${notifi?.actor?._id}/profile`}
                            className='font-bold text-[#1877f2] hover:underline'
                          >
                            {notifi.actor?.name}
                          </Link>{" "}
                          commented on{" "}
                          <Link
                            to={`/postdetails/${notifi?.entity?.id}`}
                            className='font-bold text-[#1877f2] bg-[#e7f0fd] border border-[#bed8fb] rounded px-2 py-0.5 hover:underline'
                          >
                            Your Post
                          </Link>
                        </span>
                      )}
                      {notifi.type === "follow_user" && (
                        <span>
                          <Link
                            to={`/user/${notifi?.actor?._id}/profile`}
                            className='font-bold text-[#1877f2] hover:underline'
                          >
                            {notifi.actor?.name}
                          </Link>{" "}
                          started following you
                        </span>
                      )}
                      {notifi.type === "share_post" && (
                        <span>
                          <Link
                            to={`/user/${notifi?.actor?._id}/profile`}
                            className='font-bold text-[#1877f2] hover:underline'
                          >
                            {notifi.actor?.name}
                          </Link>{" "}
                          shared{" "}
                          <Link
                            to={`/postdetails/${notifi?.entity?.id}`}
                            className='font-bold text-[#1877f2] bg-[#e7f0fd] border border-[#bed8fb] rounded px-2 py-0.5 hover:underline'
                          >
                            Your Post
                          </Link>
                        </span>
                      )}
                      {notifi.type === "like_post" && (
                        <span>
                          <Link
                            to={`/user/${notifi?.actor?._id}/profile`}
                            className='font-bold text-[#1877f2] hover:underline'
                          >
                            {notifi.actor?.name}
                          </Link>{" "}
                          liked{" "}
                          <Link
                            to={`/postdetails/${notifi?.entity?.id}`}
                            className='font-bold text-[#1877f2] bg-[#e7f0fd] border border-[#bed8fb] rounded px-2 py-0.5 hover:underline'
                          >
                            Your Post
                          </Link>
                        </span>
                      )}
                    </div>

                    <div className='flex items-center gap-3 self-end sm:self-auto'>
                      <span className='text-xs text-[#65676b] font-medium'>
                        {notifi.createdAt?.slice(0, 10)}
                      </span>

                      {isUnread && (
                        <Button
                          size='sm'
                          color='primary'
                          variant='flat'
                          className='font-bold text-xs h-7'
                          isLoading={isReading}
                          onPress={() => markAsRead(notifi._id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
      </div>
    </div>
  </>

  );
}
