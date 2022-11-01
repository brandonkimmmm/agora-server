import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isNumber } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TopicIdParamPipe implements PipeTransform {
    constructor(private readonly prismaService: PrismaService) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'param') {
            if (isNumber(value.topic_id)) {
                await this.prismaService.topic.findFirstOrThrow({
                    where: { id: value.list_id }
                });
            }
        }
        return value;
    }
}
