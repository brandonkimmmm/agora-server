import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isNumber } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentIdParamPipe implements PipeTransform {
    constructor(private readonly prismaService: PrismaService) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'param') {
            if (isNumber(value.comment_id)) {
                const commentId = value.comment_id;
                const postId = isNumber(value.post_id) ? value.post_id : null;
                if (postId) {
                    await this.prismaService.comment.findFirstOrThrow({
                        where: { id: commentId, post_id: postId }
                    });
                } else {
                    await this.prismaService.comment.findFirstOrThrow({
                        where: { id: commentId }
                    });
                }
            }
        }
        return value;
    }
}
