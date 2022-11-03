import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toUpper } from 'lodash';
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
        user_id,
        topic_title,
        post_id
    }: GetPostsDTO) {
        const where: Prisma.PostWhereInput = {};

        if (topic_id) {
            where.topic_id = topic_id;
        } else if (topic_title) {
            where.topic = {
                title: toUpper(topic_title)
            };
        }

        if (user_id) {
            where.user_id = user_id;
        }

        if (post_id) {
            where.id = post_id;
        }

        const [count, data] = await this.prismaService.$transaction(
            async (prisma) => {
                const count = await prisma.post.count({ where });
                const data = await prisma.post.findMany({
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
                        _count: {
                            select: {
                                comments: true
                            }
                        },
                        topic: true
                    }
                });
                const postVotes = await prisma.vote.groupBy({
                    by: ['post_id'],
                    where: {
                        post_id: {
                            in: data.map((d) => d.id)
                        }
                    },
                    _sum: {
                        value: true
                    }
                });

                return [
                    count,
                    data.map((d) => {
                        const votes = postVotes.find((v) => v.post_id === d.id);
                        return {
                            ...d,
                            _sum: {
                                votes: votes?._sum ? votes._sum.value : 0
                            }
                        };
                    })
                ];
            }
        );

        return {
            count,
            data
        };
    }
}
