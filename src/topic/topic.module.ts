import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
    providers: [TopicService],
    controllers: [TopicController],
    imports: [PostModule]
})
export class TopicModule {}
