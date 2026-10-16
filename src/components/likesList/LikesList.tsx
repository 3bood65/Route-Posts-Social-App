import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import CardHead from "../cardHead/CardHead";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoaderScreen from "../loaderScreen/LoaderScreen";

interface LikedUser {
  _id: string;
  name: string;
  username: string;
  photo?: string;
}

export default function LikesList({
  postId,
  likesCount,
}: {
  postId: string;
  likesCount: number;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function handleLikesList() {
    return await axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/likes`,
      {
        headers: {
          AUTHORIZATION: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading } = useQuery({
    queryKey: ["handleLikesList", postId],
    queryFn: handleLikesList,
    enabled: isOpen,
  });

  const userslikes: LikedUser[] = data?.data?.data?.likes ?? [];

  return (
    <>
      <Button
        onPress={onOpen}
        className='bg-transparent p-0 m-0 min-w-0 text-xs font-semibold text-[#65676b] hover:text-[#1c1e21] h-auto'
      >
        {likesCount === 0 ? "0 Likes" : `${likesCount} Likes`}
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='sm'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1 border-b border-[#e4e6ea] pb-3 text-base font-bold text-[#1c1e21]'>
                {likesCount === 0 ? "Likes" : `Liked by ${likesCount} people`}
              </ModalHeader>
              <ModalBody className='py-4 max-h-80 overflow-y-auto'>
                {isLoading && (
                  <div className='flex justify-center py-6'>
                    <LoaderScreen size={35} />
                  </div>
                )}

                {!isLoading && userslikes.length === 0 && (
                  <p className='text-xs text-[#8a8d91] text-center py-4'>
                    No likes yet.
                  </p>
                )}

                {!isLoading &&
                  userslikes.map((userlike) => (
                    <CardHead
                      key={userlike?._id}
                      photo={userlike?.photo || ""}
                      name={userlike?.name}
                      username={userlike?.username}
                      postUserId={userlike?._id}
                    />
                  ))}
              </ModalBody>
              <ModalFooter className='border-t border-[#e4e6ea] pt-3'>
                <Button color='default' variant='flat' size='sm' onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
