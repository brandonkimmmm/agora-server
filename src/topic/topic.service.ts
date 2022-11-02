import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { upperCase } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { SerializedUser } from 'src/shared/types/user.type';
import { GetTopicsDTO, PostTopicDTO } from './dto';

@Injectable()
export class TopicService {
    private readonly logger: Logger = new Logger(TopicService.name);

    constructor(private readonly prismaService: PrismaService) {}

    async isExistingTitle(title: string) {
        this.logger.debug(`isExistingTitle title`, { title });
        const count = await this.prismaService.topic.count({
            where: { title }
        });
        return count === 1;
    }

    async findTopics({ limit, page, display_title }: GetTopicsDTO) {
        const where: Prisma.TopicWhereInput = {};

        if (display_title) {
            where.title = upperCase(display_title);
        }

        const [count, data] = await this.prismaService.$transaction([
            this.prismaService.topic.count({ where }),
            this.prismaService.topic.findMany({
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
                            posts: true
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

    async createTopic(
        reqUser: SerializedUser,
        {
            title,
            description,
            display_title,
            image_url
        }: PostTopicDTO & { title: string }
    ) {
        return this.prismaService.topic.create({
            data: {
                title,
                description,
                display_title,
                image_url,
                user: {
                    connect: {
                        id: reqUser.id
                    }
                }
            }
        });
    }
}
