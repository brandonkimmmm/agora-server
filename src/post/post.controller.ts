import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { TopicIdQueryPipe } from 'src/topic/pipes/topic-id-query.pipe';
import { TopicTitleQueryPipe } from 'src/topic/pipes/topic-title-query.pipe';
import { GetPostsDTO } from './dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
    private readonly logger: Logger = new Logger(PostController.name);

    constructor(private readonly postService: PostService) {}

    @Get()
    @UsePipes(TopicIdQueryPipe, TopicTitleQueryPipe)
    async getPosts(@Query() dto: GetPostsDTO) {
        return this.postService.findPosts(dto);
    }
}
