import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isString } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TopicTitleQueryPipe implements PipeTransform {
    constructor(private readonly prismaService: PrismaService) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'query') {
            if (isString(value.topic_title)) {
                await this.prismaService.topic.findFirstOrThrow({
                    where: { title: value.topic_title }
                });
            }
        }
        return value;
    }
}
