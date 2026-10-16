import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Form, useForm, type FieldValues } from "react-hook-form";

export default function CreateComment({
  commentsCount,
  postId,
  isPageDetails,
}: {
  commentsCount: number;
  postId: string;
  isPageDetails: boolean;
}) {
  const useQueryObj = useQueryClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { register, control, handleSubmit, reset: FormReset } = useForm();

  const handleAddComment = async function (values: FieldValues) {
    const formData = new FormData();

    if (values.content) {
      formData.append("content", values.content);
    }
    if (values.image && values.image[0]) {
      formData.append("image", values.image[0]);
    }

    return await axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const {
    mutate,
    isPending,
    isError,
    error,
    reset: MutationReset,
  } = useMutation({
    mutationFn: handleAddComment,
    onSuccess: () => {
      if (isPageDetails) {
        useQueryObj.invalidateQueries({
          queryKey: ["getPostDetails", postId],
        });
        useQueryObj.invalidateQueries({
          queryKey: ["getAllComments", postId],
        });
      } else {
        useQueryObj.invalidateQueries({
          queryKey: ["getAllPostsInfinite"],
        });
        useQueryObj.invalidateQueries({
          queryKey: ["getAllFeedPostsInfinite"],
        });
      }
      onClose();
    },
  });

  return (
    <>
      <Button
        className='bg-transparent font-semibold text-[#65676b] hover:text-[#1c1e21] text-xs p-0 m-0 h-auto flex items-center gap-1.5'
        onPress={onOpen}
      >
        <i className='fa-regular fa-comment text-sm'></i>
        <span>{commentsCount}</span>
        <span className='hidden sm:inline'>Comments</span>
      </Button>

      <Modal
        isOpen={isOpen}
        placement='top-center'
        onOpenChange={function (isOpen) {
          if (!isOpen) {
            MutationReset();
            FormReset();
          }
          onOpenChange();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col text-center font-bold text-base text-[#1c1e21] border-b border-[#e4e6ea] pb-3'>
                Add Comment
              </ModalHeader>
              <ModalBody className='py-4'>
                <Form control={control} className='flex flex-col gap-3'>
                  <Input
                    {...register("content", { required: true })}
                    label='Comment'
                    placeholder='Write your comment here...'
                    variant='bordered'
                    classNames={{
                      inputWrapper: "border-[#e4e6ea] bg-white",
                    }}
                  />
                  <Input
                    {...register("image")}
                    label='Upload Image (Optional)'
                    type='file'
                    variant='bordered'
                    accept='image/*'
                  />
                </Form>
                {isError && (
                  <p className='text-red-500 text-xs font-semibold'>
                    {axios.isAxiosError(error)
                      ? error.response?.data?.message || "Failed to add comment."
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
                  isLoading={isPending}
                  onPress={() => {
                    handleSubmit(function (values) {
                      mutate(values);
                    })();
                  }}
                >
                  Comment
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}