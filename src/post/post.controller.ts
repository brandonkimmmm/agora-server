import {
    Controller,
    Get,
    Logger,
    Param,
    Put,
    Query,
    UseGuards,
    UsePipes
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { OptionalJwtGuard } from 'src/auth/jwt/optional-jwt.guard';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { SerializedUser } from 'src/shared/types/user.type';
import { TopicIdQueryPipe } from 'src/topic/pipes/topic-id-query.pipe';
import { TopicTitleQueryPipe } from 'src/topic/pipes/topic-title-query.pipe';
import {
    GetPostCommentsDTO,
    GetPostsDTO,
    ParamCommentIdDTO,
    ParamPostIdDTO
} from './dto';
import { CommentIdParamPipe } from './pipes/comment-id-param.pipe';
import { PostIdParamPipe } from './pipes/post-id-param.pipe';
import { PostIdQueryPipe } from './pipes/post-id-query.pipe';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
    private readonly logger: Logger = new Logger(PostController.name);

    constructor(private readonly postService: PostService) {}

    @Get()
    @UsePipes(TopicIdQueryPipe, TopicTitleQueryPipe, PostIdQueryPipe)
    @UseGuards(OptionalJwtGuard)
    async getPosts(
        @Query() dto: GetPostsDTO,
        @ReqUser() reqUser?: SerializedUser
    ) {
        return this.postService.findPosts(dto, reqUser);
    }

    @Get(':post_id/comments')
    @UsePipes(PostIdParamPipe)
    @UseGuards(OptionalJwtGuard)
    async getPostComments(
        @Param() { post_id }: ParamPostIdDTO,
        @Query() dto: GetPostCommentsDTO,
        @ReqUser() reqUser?: SerializedUser
    ) {
        return this.postService.findPostComments(post_id, dto, reqUser);
    }

    @Put(':post_id/vote/up')
    @UseGuards(JwtGuard)
    @UsePipes(PostIdParamPipe)
    async putPostUpvote(
        @ReqUser() reqUser: SerializedUser,
        @Param() { post_id }: ParamPostIdDTO
    ) {
        return this.postService.postUpvote(reqUser, post_id);
    }

    @Put(':post_id/vote/down')
    @UseGuards(JwtGuard)
    @UsePipes(PostIdParamPipe)
    async putPostDownvote(
        @ReqUser() reqUser: SerializedUser,
        @Param() { post_id }: ParamPostIdDTO
    ) {
        return this.postService.postDownvote(reqUser, post_id);
    }

    @Put(':post_id/vote/reset')
    @UseGuards(JwtGuard)
    @UsePipes(PostIdParamPipe)
    async putPostResetVote(
        @ReqUser() reqUser: SerializedUser,
        @Param() { post_id }: ParamPostIdDTO
    ) {
        return this.postService.postResetVote(reqUser, post_id);
    }

    @Put(':post_id/comments/:comment_id/vote/up')
    @UseGuards(JwtGuard)
    @UsePipes(PostIdParamPipe, CommentIdParamPipe)
    async putPostCommentUpvote(
        @ReqUser() reqUser: SerializedUser,
        @Param() { comment_id }: ParamCommentIdDTO
    ) {
        return this.postService.postCommentUpvote(reqUser, comment_id);
    }

    @Put(':post_id/comments/:comment_id/vote/down')
    @UseGuards(JwtGuard)
    @UsePipes(PostIdParamPipe, CommentIdParamPipe)
    async putPostCommentDownvote(
        @ReqUser() reqUser: SerializedUser,
        @Param() { comment_id }: ParamCommentIdDTO
    ) {
        return this.postService.postCommentDownvote(reqUser, comment_id);
    }

    @Put(':post_id/comments/:comment_id/vote/reset')
    @UseGuards(JwtGuard)
    @UsePipes(PostIdParamPipe, CommentIdParamPipe)
    async putPostCommentResetVote(
        @ReqUser() reqUser: SerializedUser,
        @Param() { comment_id }: ParamCommentIdDTO
    ) {
        return this.postService.postCommentResetVote(reqUser, comment_id);
    }
}
