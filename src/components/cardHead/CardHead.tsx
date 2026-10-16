import { CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@heroui/react";

import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { Form, useForm, type FieldValues } from "react-hook-form";

export default function CardHead({
  photo,
  name,
  createdAt,
  username,
  postUserId = "",
  postId = "",
  commentUserId,
  commentId,
  isComment = false,
  isCommentDelete = false,
  content = "",
  body = "",
  image = "",
  isBookMarked,
  isPostHead = false,
}: {
  photo: string;
  username?: string;
  name?: string;
  createdAt?: string;
  postUserId?: string;
  postId?: string;
  commentUserId?: string;
  commentId?: string;
  isComment?: boolean;
  isCommentDelete?: boolean;
  content?: string;
  body?: string;
  image?: string;
  isBookMarked?: boolean;
  isPostHead?: boolean;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { userId, userToken } = useContext(AuthContext);
  const objQueryClient = useQueryClient();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageRefPreview = useRef<HTMLInputElement | null>(null);

  const isOwner =
    Boolean(userId) &&
    (String(postUserId) === String(userId) ||
      String(commentUserId) === String(userId));

  async function handleDeletePost() {
    return await axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, {
      headers: { AUTHORIZATION: `Bearer ${userToken}` },
    });
  }

  function toggleBookMarkedPosts() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
      {},
      {
        headers: { AUTHORIZATION: `Bearer ${userToken}` },
      },
    );
  }

  const { mutate: BookMarkedMutate } = useMutation({
    mutationKey: ["toggleBookMarkedPosts"],
    mutationFn: toggleBookMarkedPosts,
    onSuccess: () => {
      objQueryClient.invalidateQueries({ queryKey: ["getAllPostsInfinite"] });
      objQueryClient.invalidateQueries({ queryKey: ["getAllFeedPostsInfinite"] });
      objQueryClient.invalidateQueries({ queryKey: ["getAllBookMarksPostsInfinite"] });
      objQueryClient.invalidateQueries({ queryKey: ["getProfilePosts"] });
    },
  });

  async function handleDeletecomment() {
    return await axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      { headers: { AUTHORIZATION: `Bearer ${userToken}` } },
    );
  }

  interface CardHeadFormValues {
    content?: string;
    body?: string;
    image?: FileList | null;
  }

  const { register, control, handleSubmit, setValue } = useForm<CardHeadFormValues>({
    defaultValues: {
      content: content,
      body: body,
      image: null,
    },
  });

  const {
    onChange: imageRegisterOnChange,
    ref: imageRegisterRef,
    ...imageRegisterRest
  } = register("image");

  const handelEditComment = async function (values: FieldValues) {
    const formData = new FormData();
    if (values.content) {
      formData.append("content", values.content);
    }
    if (
      values.image &&
      typeof values.image !== "string" &&
      values.image.length > 0
    ) {
      formData.append("image", values.image[0]);
    }
    return await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const handelEditPost = async function (values: FieldValues) {
    const formData = new FormData();
    if (values.body) {
      formData.append("body", values.body);
    }

    if (
      values.image &&
      typeof values.image !== "string" &&
      values.image.length > 0
    ) {
      formData.append("image", values.image[0]);
    }
    return await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  };

  const { mutate: mutateDeletePost } = useMutation({
    mutationFn: handleDeletePost,
    onSuccess: () => {
      objQueryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      objQueryClient.invalidateQueries({ queryKey: ["getAllFeedPosts"] });
      objQueryClient.invalidateQueries({ queryKey: ["getAllComments"] });
      objQueryClient.invalidateQueries({ queryKey: ["getProfilePosts"] });
    },
  });

  const { mutate: mutateDeletecomment } = useMutation({
    mutationFn: handleDeletecomment,
    onSuccess: () => {
      objQueryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      objQueryClient.invalidateQueries({ queryKey: ["getAllComments"] });
    },
  });

  const { mutate: editMutatePost, isPending: isEditingPost } = useMutation({
    mutationFn: handelEditPost,
    onSuccess: () => {
      objQueryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      objQueryClient.invalidateQueries({ queryKey: ["getAllFeedPosts"] });
      objQueryClient.invalidateQueries({ queryKey: ["getPostDetails", postId] });
    },
  });

  const { mutate: editMutateComment, isPending: isEditingComment } = useMutation({
    mutationFn: handelEditComment,
    onSuccess: () => {
      objQueryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      objQueryClient.invalidateQueries({ queryKey: ["getAllComments"] });
    },
  });

  function handleDeleteMutete() {
    if (isCommentDelete) {
      mutateDeletecomment();
    } else {
      mutateDeletePost();
    }
  }

  function handleEditMutate(values: FieldValues) {
    if (isComment) {
      editMutateComment(values);
    } else {
      editMutatePost(values);
    }
  }

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
    setValue("image", null);
  }

  return (
    <>
      <CardHeader className='justify-between px-4 py-3'>
        <Link
          to={postUserId ? `/user/${postUserId}/profile` : "#"}
          className='flex items-center gap-3 hover:opacity-85 transition'
        >
          <Image
            alt='Profile'
            height={38}
            src={
              photo ||
              "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
            }
            width={38}
            className='rounded-full object-cover border border-[#e4e6ea]'
            fallbackSrc='https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png'
          />
          <div className='flex flex-col'>
            <span className='text-sm font-bold text-[#1c1e21] leading-tight hover:underline'>
              {name || "User"}
            </span>
            <span className='text-xs text-[#65676b] font-medium'>
              {username ? `@${username}` : createdAt?.slice(0, 10)}
            </span>
          </div>
        </Link>

        <div className='flex items-center gap-1'>
          {isPostHead && (
            <Button
              className={`bg-transparent p-0 m-0 ${isBookMarked ? "text-[#1877f2]" : "text-[#65676b] hover:text-[#1c1e21]"}`}
              isIconOnly
              size='sm'
              onPress={() => BookMarkedMutate()}
              aria-label={isBookMarked ? "Remove Bookmark" : "Bookmark Post"}
            >
              {isBookMarked ? (
                <i className='fa-solid fa-bookmark text-base'></i>
              ) : (
                <i className='fa-regular fa-bookmark text-base'></i>
              )}
            </Button>
          )}

          {isOwner && (
            <Dropdown placement='bottom-end'>
              <DropdownTrigger>
                <Button
                  className='bg-transparent text-[#65676b] hover:text-[#1c1e21]'
                  isIconOnly
                  size='sm'
                  aria-label='More options'
                >
                  <i className='fa-solid fa-ellipsis text-base'></i>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label='Actions'>
                <DropdownItem
                  key='edit'
                  onPress={() => {
                    onOpen();
                    setValue(
                      isComment ? "content" : "body",
                      isComment ? content : body,
                    );
                    setImagePreview(null);
                  }}
                >
                  <div className='flex items-center gap-2 text-xs font-semibold'>
                    <i className='fa-solid fa-pen-to-square text-[#1877f2]'></i>
                    Edit {isComment ? "Comment" : "Post"}
                  </div>
                </DropdownItem>

                <DropdownItem
                  key='delete'
                  className='text-danger'
                  color='danger'
                  onPress={handleDeleteMutete}
                >
                  <div className='flex items-center gap-2 text-xs font-semibold'>
                    <i className='fa-solid fa-trash'></i>
                    Delete {isComment ? "Comment" : "Post"}
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>

        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1 text-base font-bold'>
                  Edit {isComment ? "Comment" : "Post"}
                </ModalHeader>
                <ModalBody>
                  <Form control={control} className='flex flex-col gap-3 w-full'>
                    <Input
                      {...register(isComment ? "content" : "body")}
                      label={isComment ? "Comment text" : "Post text"}
                      placeholder='Type your text here...'
                      variant='bordered'
                      classNames={{
                        inputWrapper: "border-[#e4e6ea] bg-white",
                      }}
                    />

                    {!isComment && image && !imagePreview && (
                      <div className='flex flex-col gap-1'>
                        <span className='text-xs text-[#65676b] font-semibold'>
                          Current Image:
                        </span>
                        <Image
                          src={image}
                          alt='Attached media'
                          className='max-h-40 rounded-lg object-cover'
                        />
                      </div>
                    )}

                    {!isComment && (
                      <Input
                        label='Upload New Image (Optional)'
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
                    )}
                  </Form>

                  {imagePreview && (
                    <div className='relative w-full mt-2'>
                      <button
                        onClick={closeImagePreview}
                        type='button'
                        className='absolute top-2 right-2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 cursor-pointer flex items-center justify-center transition'
                      >
                        <i className='fa-solid fa-xmark text-xs'></i>
                      </button>
                      <img
                        src={imagePreview}
                        className='w-full max-h-60 rounded-xl object-cover'
                        alt='Preview'
                      />
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color='danger' variant='flat' size='sm' onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color='primary'
                    size='sm'
                    className='font-bold'
                    isLoading={isEditingPost || isEditingComment}
                    onPress={() => {
                      handleSubmit(function (values) {
                        handleEditMutate(values);
                        onClose();
                      })();
                    }}
                  >
                    Save Changes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </CardHeader>
    </>
  );
}
