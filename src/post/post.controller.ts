import {
    Controller,
    Get,
    Logger,
    Param,
    Query,
    UsePipes
} from '@nestjs/common';
import { TopicIdQueryPipe } from 'src/topic/pipes/topic-id-query.pipe';
import { TopicTitleQueryPipe } from 'src/topic/pipes/topic-title-query.pipe';
import { GetPostCommentsDTO, GetPostsDTO, ParamPostIdDTO } from './dto';
import { PostIdParamPipe } from './pipes/post-id-param.pipe';
import { PostIdQueryPipe } from './pipes/post-id-query.pipe';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
    private readonly logger: Logger = new Logger(PostController.name);

    constructor(private readonly postService: PostService) {}

    @Get()
    @UsePipes(TopicIdQueryPipe, TopicTitleQueryPipe, PostIdQueryPipe)
    async getPosts(@Query() dto: GetPostsDTO) {
        return this.postService.findPosts(dto);
    }

    @Get(':post_id/comments')
    @UsePipes(PostIdParamPipe)
    async getPostComments(
        @Param() { post_id }: ParamPostIdDTO,
        @Query() dto: GetPostCommentsDTO
    ) {
        return this.postService.findPostComments(post_id, dto);
    }
}
