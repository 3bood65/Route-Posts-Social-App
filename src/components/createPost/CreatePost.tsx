import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import { Form, useForm } from "react-hook-form";

export default function CreatePost({
  isOpen,
  onOpenChange,
  onClose,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}) {
  const { register, control, handleSubmit, reset: FormReset } = useForm();
  const {
    ref: imageRegisterRef,
    onChange: imageRegisterOnChange,
    ...imageRegisterRest
  } = register("image");
  const { ref: inputRegisterRef, ...inputRegister } = register("body");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageRefPreview = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const useQueryObj = useQueryClient();

  const handleCreatePost = async function (values: { body?: string; image?: FileList }) {
    const formData = new FormData();

    if (values.body) {
      formData.append("body", values.body);
    }
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }
    return await axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  };

  const {
    error,
    isError,
    mutate,
    isPending,
    reset: MutationReset,
  } = useMutation({
    mutationFn: handleCreatePost,
    onSuccess: () => {
      useQueryObj.invalidateQueries({
        queryKey: ["getAllPostsInfinite"],
      });
      useQueryObj.invalidateQueries({
        queryKey: ["getAllFeedPostsInfinite"],
      });
      onClose();
    },
  });

  function handleImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  }

  function closeImagePreview() {
    setImagePreview(null);
    if (imageRefPreview.current) {
      imageRefPreview.current.value = "";
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      placement='top-center'
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          MutationReset();
          FormReset();
          closeImagePreview();
        }
        onOpenChange();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col text-center font-bold text-base text-[#1c1e21] border-b border-[#e4e6ea] pb-3'>
              Create Post
            </ModalHeader>
            <ModalBody className='py-4'>
              <Form control={control} className='flex flex-col gap-3'>
                <Input
                  label="What's on your mind?"
                  placeholder="Share what you're thinking..."
                  variant='bordered'
                  classNames={{
                    inputWrapper: "border-[#e4e6ea] bg-white",
                  }}
                  {...inputRegister}
                  ref={(e: HTMLInputElement | null) => {
                    inputRef.current = e;
                    inputRegisterRef(e);
                  }}
                />
                <Input
                  label='Upload Image (Optional)'
                  type='file'
                  variant='bordered'
                  accept='image/*'
                  {...imageRegisterRest}
                  onChange={(e) => {
                    imageRegisterOnChange(e);
                    handleImagePreview(e);
                  }}
                  ref={(e: HTMLInputElement | null) => {
                    imageRegisterRef(e);
                    imageRefPreview.current = e;
                  }}
                />
              </Form>

              {imagePreview && (
                <div className='relative w-full rounded-xl overflow-hidden mt-1'>
                  <button
                    onClick={closeImagePreview}
                    type='button'
                    className='absolute top-2 right-2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 cursor-pointer flex items-center justify-center transition'
                  >
                    <i className='fa-solid fa-xmark text-xs'></i>
                  </button>
                  <img
                    src={imagePreview}
                    className='w-full max-h-72 object-cover object-center rounded-xl'
                    alt='Post attachment preview'
                  />
                </div>
              )}

              {isError && (
                <p className='text-red-500 text-xs font-semibold'>
                  {axios.isAxiosError(error)
                    ? error.response?.data?.message || "Failed to create post."
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
                  handleSubmit((values) => {
                    mutate(values);
                  })();
                }}
              >
                Post
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}