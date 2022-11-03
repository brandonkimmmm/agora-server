import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isNumber } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostIdQueryPipe implements PipeTransform {
    constructor(private readonly prismaService: PrismaService) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'query') {
            if (isNumber(value.post_id)) {
                await this.prismaService.post.findFirstOrThrow({
                    where: { id: value.post_id }
                });
            }
        }
        return value;
    }
}
