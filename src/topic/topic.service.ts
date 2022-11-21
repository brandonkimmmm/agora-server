import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { omit, pick, toUpper } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { SerializedUser } from 'src/shared/types/user.type';
import { GetTopicsAvailableDTO, GetTopicsDTO, PostTopicDTO } from './dto';

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

    async findAvailableTopics(
        { search }: GetTopicsAvailableDTO,
        user: SerializedUser
    ) {
        const where: Prisma.TopicWhereInput = {};

        if (search) {
            where.OR = [
                {
                    title: {
                        contains: search
                    }
                },
                {
                    display_title: {
                        contains: search
                    }
                }
            ];
        }

        const topics = await this.prismaService.topic.findMany({
            select: {
                id: true,
                title: true,
                display_title: true,
                image_url: true,
                favorites: {
                    where: {
                        user_id: user.id
                    },
                    select: {
                        value: true
                    }
                }
            }
        });

        return topics.map((t) => {
            return {
                ...omit(t, 'favorites'),
                subscribed: user
                    ? t.favorites[0]
                        ? t.favorites[0].value
                        : false
                    : undefined
            };
        });
    }

    async findTopics({ limit, page, display_title }: GetTopicsDTO) {
        const where: Prisma.TopicWhereInput = {};

        if (display_title) {
            where.title = toUpper(display_title);
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

    async findUserTopics(userId: number) {
        const where = {
            favorites: {
                some: {
                    user_id: userId,
                    value: true
                }
            }
        };
        const [count, data] = await this.prismaService.$transaction([
            this.prismaService.topic.count({
                where
            }),
            this.prismaService.topic.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    display_title: true,
                    image_url: true
                }
            })
        ]);

        return {
            count,
            data
        };
    }

    async topicSubscribe(user: SerializedUser, title: string) {
        const topic = await this.prismaService.topic.findFirst({
            where: {
                title
            },
            include: {
                favorites: {
                    where: {
                        user_id: user.id
                    }
                }
            }
        });
        const favorite = topic.favorites.find((f) => f.user_id === user.id);
        if (favorite) {
            await this.prismaService.favorite.update({
                where: {
                    id: favorite.id
                },
                data: {
                    value: true
                }
            });
        } else {
            await this.prismaService.favorite.create({
                data: {
                    topic_id: topic.id,
                    user_id: user.id,
                    value: true
                }
            });
        }
        return pick(topic, ['id', 'title', 'display_title', 'image_url']);
    }

    async topicUnsubscribe(user: SerializedUser, title: string) {
        const topic = await this.prismaService.topic.findFirst({
            where: {
                title
            },
            include: {
                favorites: {
                    where: {
                        user_id: user.id
                    }
                }
            }
        });
        const favorite = topic.favorites.find((f) => f.user_id === user.id);
        if (favorite) {
            await this.prismaService.favorite.update({
                where: {
                    id: favorite.id
                },
                data: {
                    value: false
                }
            });
        } else {
            await this.prismaService.favorite.create({
                data: {
                    topic_id: topic.id,
                    user_id: user.id,
                    value: false
                }
            });
        }
        return pick(topic, ['id', 'title', 'display_title', 'image_url']);
    }
}
