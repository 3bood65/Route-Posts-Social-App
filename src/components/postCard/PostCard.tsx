import { Card, CardBody, CardFooter } from "@heroui/card";
import type { Comment, IPost } from "../interface/PostInterface";
import CardHead from "../cardHead/CardHead";
import { Link } from "react-router";
import CreateComment from "../createComment/CreateComment";
import LikeBtn from "../likeBtn/LikeBtn";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LikesList from "../likesList/LikesList";
import CommentItem from "../commentItem/CommentItem";
import { renderTextWithLinks } from "../formatText/FormatText";

export default function PostCard({
  post,
  isPageDetails = false,
  allCommentsData,
  isShearedPost: propIsShearedPost,
}: {
  post: IPost;
  isPageDetails?: boolean;
  allCommentsData?: Comment[];
  isShearedPost?: boolean;
}) {
  const { userId } = useContext(AuthContext);
  const { topComment } = post ?? {};

  const isShearedPost = propIsShearedPost || Boolean(post?.sharedPost);

  const {
    commentCreator,
    content,
    createdAt: commentCreatedAt,
  } = topComment ?? {};
  const { name: commentCreatorName, photo: commentCreatorPhoto } =
    commentCreator ?? {};
  const likesList = post?.likes ?? [];
  const isLiked = likesList.includes(userId);

  return (
    <>
      <Card className='w-full bg-white rounded-2xl border border-[#e4e6ea] shadow-xs hover:shadow-sm transition-shadow duration-150 overflow-hidden mb-4'>
        <CardHead
          postId={post?._id}
          postUserId={post?.user?._id}
          username={post?.user?.username}
          name={post?.user?.name}
          photo={post?.user?.photo || ""}
          body={post?.body}
          image={post?.image}
          isComment={false}
          isBookMarked={post?.bookmarked}
          isPostHead={true}
        />

        <CardBody className='px-4 pt-1 pb-3 text-sm'>
          {isShearedPost ? (
            <div className='w-full'>
              {isPageDetails ? (
                <p className='text-[#1c1e21] text-base font-normal mb-3 whitespace-pre-wrap' dir='auto'>
                  {renderTextWithLinks(post?.body)}
                </p>
              ) : (
                <Link to={`/postdetails/${post?.id || post?._id}`}>
                  <p className='text-[#1c1e21] text-base font-normal mb-3 hover:text-[#1877f2] transition whitespace-pre-wrap' dir='auto'>
                    {renderTextWithLinks(post?.body)}
                  </p>
                </Link>
              )}
              <div className='rounded-xl border border-[#e4e6ea] bg-[#f7f8fa] p-3 overflow-hidden'>
                <CardHead
                  postId={post?.sharedPost?._id}
                  postUserId={post?.sharedPost?.user?._id}
                  username={post?.sharedPost?.user?.username}
                  name={post?.sharedPost?.user?.name}
                  photo={post?.sharedPost?.user?.photo || ""}
                  body={post?.sharedPost?.body}
                  image={post?.sharedPost?.image}
                />
                <Link to={`/postdetails/${post?.sharedPost?._id}`}>
                  <p className='text-[#1c1e21] text-sm mt-2 mb-2 whitespace-pre-wrap' dir='auto'>
                    {post?.sharedPost?.body}
                  </p>
                  {post?.sharedPost?.image && (
                    <img
                      className='w-full max-h-96 object-cover rounded-lg'
                      src={post?.sharedPost?.image}
                      alt={`${post?.sharedPost?.user?.name || "Shared"}'s post media`}
                      loading='lazy'
                    />
                  )}
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {isPageDetails ? (
                <p className='text-[#1c1e21] text-base font-normal mb-3 whitespace-pre-wrap' dir='auto'>
                  {post?.body}
                </p>
              ) : (
                <Link to={`/postdetails/${post?.id || post?._id}`}>
                  <p className='text-[#1c1e21] text-base font-normal mb-3 hover:text-[#1877f2] transition whitespace-pre-wrap' dir='auto'>
                    {post?.body}
                  </p>
                </Link>
              )}

              {post?.image && (
                <div className='rounded-xl overflow-hidden mt-1'>
                  {isPageDetails ? (
                    <img
                      className='w-full max-h-[550px] object-cover'
                      src={post?.image}
                      alt={`${post?.user?.name || "Post"}'s media`}
                      loading='lazy'
                    />
                  ) : (
                    <Link to={`/postdetails/${post?.id || post?._id}`}>
                      <img
                        className='w-full max-h-[550px] object-cover hover:opacity-95 transition'
                        src={post?.image}
                        alt={`${post?.user?.name || "Post"}'s media`}
                        loading='lazy'
                      />
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </CardBody>

        <CardFooter className='border-t border-[#e4e6ea] px-3 py-1 flex items-center justify-between text-xs text-[#65676b]'>
          <div className='flex items-center gap-1 hover:bg-[#f0f2f5] rounded-lg px-2 py-1 transition'>
            <LikeBtn postId={post?.id || post?._id} isLiked={isLiked} />
            <LikesList postId={post?._id} likesCount={post?.likesCount ?? 0} />
          </div>

          <div className='flex items-center hover:bg-[#f0f2f5] rounded-lg px-2 py-1 transition'>
            <CreateComment
              isPageDetails={isPageDetails}
              commentsCount={post?.commentsCount ?? 0}
              postId={post?._id}
            />
          </div>

          <div className='flex items-center gap-1.5 px-2 py-1'>
            <i className='fa-solid fa-share-nodes text-[#65676b]'></i>
            <span className='font-bold text-[#1c1e21]'>{post?.sharesCount ?? 0}</span>
            <span className='hidden sm:inline'>shares</span>
          </div>

          <div className='hidden sm:flex items-center gap-1 text-[11px] text-[#8a8d91] px-2 py-1'>
            <span>{post?.createdAt?.slice(0, 10)}</span>
          </div>
        </CardFooter>

        {!isPageDetails && topComment != null && (
          <div className='border-t border-[#f0f2f5] bg-[#fafbfc] px-4 py-3'>
            <p className='text-[10px] font-bold uppercase tracking-wider text-[#8a8d91] mb-2'>
              Top Comment
            </p>
            <CardHead
              isComment={true}
              name={commentCreatorName}
              photo={commentCreatorPhoto || ""}
              createdAt={commentCreatedAt}
              commentUserId={commentCreator?._id}
              commentId={topComment?._id}
              isCommentDelete={true}
              postId={post?._id}
            />
            <p className='text-xs text-[#1c1e21] ms-11 mt-1'>{content}</p>
          </div>
        )}

        {isPageDetails && allCommentsData && allCommentsData.length > 0 && (
          <div className='border-t border-[#e4e6ea] bg-[#fafbfc] px-4 py-4 space-y-3'>
            <h3 className='text-xs font-bold uppercase tracking-wider text-[#65676b]'>
              Comments ({allCommentsData.length})
            </h3>
            {allCommentsData.map((comment: Comment) => (
              <CommentItem
                key={comment?._id}
                comment={comment}
                postId={post?._id}
              />
            ))}
          </div>
        )}
      </Card>
    </>

  );
}