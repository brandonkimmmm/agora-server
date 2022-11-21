import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isString, toUpper } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TopicTitleBodyPipe implements PipeTransform {
    constructor(private readonly prismaService: PrismaService) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'body') {
            if (isString(value.topic_title)) {
                await this.prismaService.topic.findFirstOrThrow({
                    where: { title: toUpper(value.topic_title) }
                });
            }
        }
        return value;
    }
}
