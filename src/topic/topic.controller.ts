import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Logger,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { toUpper } from 'lodash';
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
    async getTopics(@Query() dto: GetTopicsDTO) {
        return this.topicService.findTopics(dto);
    }

    @Post()
    @UseGuards(JwtGuard)
    async postTopic(
        @ReqUser() reqUser: SerializedUser,
        @Body() dto: PostTopicDTO
    ) {
        const title = toUpper(dto.display_title);
        const isTakenTitle = await this.topicService.isExistingTitle(title);
        if (isTakenTitle) throw new BadRequestException('Topic already exists');
        return this.topicService.createTopic(reqUser, { ...dto, title });
    }
}
