import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { SerializedUser } from 'src/shared/types/user.type';
import { GetTopicsDTO, PostTopicDTO } from './dto';
import { TopicService } from './topic.service';

@Controller('topics')
export class TopicController {
    private readonly logger: Logger = new Logger(TopicController.name);

    constructor(private readonly topicService: TopicService) {}

    @Get()
    async getTopics(@Body() dto: GetTopicsDTO) {
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
