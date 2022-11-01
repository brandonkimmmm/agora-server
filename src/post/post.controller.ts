import { Controller, Get, Logger, Query } from '@nestjs/common';
import { GetPostsDTO } from './dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
    private readonly logger: Logger = new Logger(PostController.name);

    constructor(private readonly postService: PostService) {}

    @Get()
    async getPosts(@Query() { limit, page }: GetPostsDTO) {
        return this.postService.findPosts({ limit, page });
    }
}
