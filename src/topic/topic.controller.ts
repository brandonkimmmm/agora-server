import {
    Body,
    Controller,
    Get,
    Logger,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { PostService } from 'src/post/post.service';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { SerializedUser } from 'src/shared/types/user.type';
import { GetTopicsDTO, PostTopicDTO } from './dto';
import { TopicService } from './topic.service';

@Controller('topics')
export class TopicController {
    private readonly logger: Logger = new Logger(TopicController.name);

    constructor(
        private readonly topicService: TopicService,
        private readonly postService: PostService
    ) {}

    @Get()
    async getTopics(@Query() dto: GetTopicsDTO) {
        return this.topicService.findTopics(dto);
    }

    @Post()
    @UseGuards(JwtGuard)
    async postTopic(
        @ReqUser() reqUser: SerializedUser,
        @Body() dto: PostTopicDTO
    ) {
        return this.topicService.createTopic(reqUser, dto);
    }
}
