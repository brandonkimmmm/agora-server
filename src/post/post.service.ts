import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPostsDTO } from './dto';

@Injectable()
export class PostService {
    private readonly logger: Logger = new Logger(PostService.name);

    constructor(private readonly prismaService: PrismaService) {}

    async findPosts({
        limit,
        page,
        topic_id,
        user_id
    }: GetPostsDTO & { topic_id?: number }) {
        const where: Prisma.PostWhereInput = {};

        if (topic_id) {
            where.topic_id = topic_id;
        }

        if (user_id) {
            where.user_id = user_id;
        }

        const [count, data] = await this.prismaService.$transaction([
            this.prismaService.post.count({ where }),
            this.prismaService.post.findMany({
                where,
                orderBy: {
                    created_at: 'desc'
                },
                ...this.prismaService.generatePaginationQuery(limit, page),
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true
                        }
                    },
                    votes: {
                        select: {
                            value: true
                        }
                    }
                }
            })
        ]);

        return {
            count,
            data
        };
    }
}
