import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes
} from '@nestjs/common';
import { toUpper } from 'lodash';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { OptionalJwtGuard } from 'src/auth/jwt/optional-jwt.guard';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { SerializedUser } from 'src/shared/types/user.type';
import {
    GetTopicsAvailableDTO,
    GetTopicsDTO,
    ParamTopicTitleDTO,
    PostTopicDTO
} from './dto';
import { TopicTitleParamPipe } from './pipes/topic-title-param.pipe';
import { TopicService } from './topic.service';

@Controller('topics')
export class TopicController {
    private readonly logger: Logger = new Logger(TopicController.name);

    constructor(private readonly topicService: TopicService) {}

    @Get()
    async getTopics(@Query() dto: GetTopicsDTO) {
        return this.topicService.findTopics(dto);
    }

    @Get('available')
    @UseGuards(OptionalJwtGuard)
    async getTopicsAvailable(
        @Query() dto: GetTopicsAvailableDTO,
        @ReqUser() reqUser?: SerializedUser
    ) {
        return this.topicService.findAvailableTopics(dto, reqUser);
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

    @Get('subscriptions')
    @UseGuards(JwtGuard)
    async getUserTopics(@ReqUser() reqUser: SerializedUser) {
        return this.topicService.findUserTopics(reqUser.id);
    }

    @Put(':topic_title/subscribe')
    @UseGuards(JwtGuard)
    @UsePipes(TopicTitleParamPipe)
    async putTopicSubscribe(
        @ReqUser() reqUser: SerializedUser,
        @Param() { topic_title }: ParamTopicTitleDTO
    ) {
        const title = toUpper(topic_title);
        return this.topicService.topicSubscribe(reqUser, title);
    }

    @Put(':topic_title/unsubscribe')
    @UseGuards(JwtGuard)
    @UsePipes(TopicTitleParamPipe)
    async putTopicUnsubscribe(
        @ReqUser() reqUser: SerializedUser,
        @Param() { topic_title }: ParamTopicTitleDTO
    ) {
        const title = toUpper(topic_title);
        return this.topicService.topicUnsubscribe(reqUser, title);
    }
}
