import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SerializedUser } from 'src/shared/types/user.type';
import { GetTopicsDTO, PostTopicDTO } from './dto';

@Injectable()
export class TopicService {
    private readonly logger: Logger = new Logger(TopicService.name);

    constructor(private readonly prismaService: PrismaService) {}

    async findTopics({ limit, page }: GetTopicsDTO) {
        const [count, data] = await this.prismaService.$transaction([
            this.prismaService.topic.count(),
            this.prismaService.topic.findMany({
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
        { title, description, display_title, image_url }: PostTopicDTO
    ) {
        return this.prismaService.topic.create({
            data: {
                title,
                description,
                display_title: display_title || title,
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
