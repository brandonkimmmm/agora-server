import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toUpper } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { SerializedUser } from 'src/shared/types/user.type';
import { GetPostCommentsDTO, GetPostsDTO } from './dto';

@Injectable()
export class PostService {
    private readonly logger: Logger = new Logger(PostService.name);

    constructor(private readonly prismaService: PrismaService) {}

    async findPostComments(
        postId: number,
        { limit, page }: GetPostCommentsDTO,
        user?: SerializedUser
    ) {
        const where = {
            post_id: postId
        };
        const [count, data] = await this.prismaService.$transaction(
            async (prisma) => {
                const count = await prisma.comment.count({ where });
                const data = await prisma.comment.findMany({
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
                        post: {
                            select: {
                                id: true
                            }
                        },
                        votes: user
                            ? {
                                  where: {
                                      user_id: user.id
                                  },
                                  select: {
                                      value: true
                                  }
                              }
                            : false
                    }
                });

                const commentVotes = await prisma.vote.groupBy({
                    by: ['comment_id'],
                    where: {
                        comment_id: {
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
                        const votes = commentVotes.find(
                            (v) => v.comment_id === d.id
                        );
                        return {
                            ...d,
                            _sum: {
                                votes: votes?._sum ? votes._sum.value : 0
                            },
                            user_vote: d.votes
                                ? d.votes[0]
                                    ? d.votes[0].value
                                    : 0
                                : null
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

    async findPosts(
        { limit, page, topic_id, user_id, topic_title, post_id }: GetPostsDTO,
        user?: SerializedUser
    ) {
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
                        topic: true,
                        votes: user
                            ? {
                                  where: {
                                      user_id: user.id
                                  },
                                  select: {
                                      value: true
                                  }
                              }
                            : false
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
                            },
                            user_vote: d.votes
                                ? d.votes[0]
                                    ? d.votes[0].value
                                    : 0
                                : null
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

    async postUpvote(user: SerializedUser, postId: number) {
        let vote = await this.prismaService.vote.findFirst({
            where: {
                post_id: postId,
                user_id: user.id
            },
            include: {
                post: {
                    select: {
                        topic: {
                            select: {
                                id: true,
                                title: true,
                                display_title: true
                            }
                        }
                    }
                }
            }
        });

        if (vote) {
            vote = await this.prismaService.vote.update({
                where: {
                    id: vote.id
                },
                data: {
                    value: 1
                },
                include: {
                    post: {
                        select: {
                            topic: {
                                select: {
                                    id: true,
                                    title: true,
                                    display_title: true
                                }
                            }
                        }
                    }
                }
            });
        } else {
            vote = await this.prismaService.vote.create({
                data: {
                    post_id: postId,
                    user_id: user.id,
                    value: 1
                },
                include: {
                    post: {
                        select: {
                            topic: {
                                select: {
                                    id: true,
                                    title: true,
                                    display_title: true
                                }
                            }
                        }
                    }
                }
            });
        }

        const postVotes = await this.prismaService.vote.groupBy({
            by: ['post_id'],
            where: {
                post_id: postId
            },
            _sum: {
                value: true
            }
        });

        const votes = postVotes.find((v) => v.post_id === postId);

        return {
            id: postId,
            _sum: {
                votes: votes?._sum ? votes._sum.value : 0
            },
            user_vote: 1,
            topic: {
                id: vote.post.topic.id,
                title: vote.post.topic.title,
                display_title: vote.post.topic.display_title
            }
        };
    }

    async postDownvote(user: SerializedUser, postId: number) {
        let vote = await this.prismaService.vote.findFirst({
            where: {
                post_id: postId,
                user_id: user.id
            },
            include: {
                post: {
                    select: {
                        topic: {
                            select: {
                                id: true,
                                title: true,
                                display_title: true
                            }
                        }
                    }
                }
            }
        });

        if (vote) {
            vote = await this.prismaService.vote.update({
                where: {
                    id: vote.id
                },
                data: {
                    value: -1
                },
                include: {
                    post: {
                        select: {
                            topic: {
                                select: {
                                    id: true,
                                    title: true,
                                    display_title: true
                                }
                            }
                        }
                    }
                }
            });
        } else {
            vote = await this.prismaService.vote.create({
                data: {
                    post_id: postId,
                    user_id: user.id,
                    value: -1
                },
                include: {
                    post: {
                        select: {
                            topic: {
                                select: {
                                    id: true,
                                    title: true,
                                    display_title: true
                                }
                            }
                        }
                    }
                }
            });
        }
        const postVotes = await this.prismaService.vote.groupBy({
            by: ['post_id'],
            where: {
                post_id: postId
            },
            _sum: {
                value: true
            }
        });

        const votes = postVotes.find((v) => v.post_id === postId);

        return {
            id: postId,
            _sum: {
                votes: votes?._sum ? votes._sum.value : 0
            },
            user_vote: -1,
            topic: {
                id: vote.post.topic.id,
                title: vote.post.topic.title,
                display_title: vote.post.topic.display_title
            }
        };
    }

    async postResetVote(user: SerializedUser, postId: number) {
        let vote = await this.prismaService.vote.findFirst({
            where: {
                post_id: postId,
                user_id: user.id
            },
            include: {
                post: {
                    select: {
                        topic: {
                            select: {
                                id: true,
                                title: true,
                                display_title: true
                            }
                        }
                    }
                }
            }
        });

        if (vote) {
            vote = await this.prismaService.vote.update({
                where: {
                    id: vote.id
                },
                data: {
                    value: 0
                },
                include: {
                    post: {
                        select: {
                            topic: {
                                select: {
                                    id: true,
                                    title: true,
                                    display_title: true
                                }
                            }
                        }
                    }
                }
            });
        } else {
            vote = await this.prismaService.vote.create({
                data: {
                    post_id: postId,
                    user_id: user.id,
                    value: 0
                },
                include: {
                    post: {
                        select: {
                            topic: {
                                select: {
                                    id: true,
                                    title: true,
                                    display_title: true
                                }
                            }
                        }
                    }
                }
            });
        }
        const postVotes = await this.prismaService.vote.groupBy({
            by: ['post_id'],
            where: {
                post_id: postId
            },
            _sum: {
                value: true
            }
        });

        const votes = postVotes.find((v) => v.post_id === postId);

        return {
            id: postId,
            _sum: {
                votes: votes?._sum ? votes._sum.value : 0
            },
            user_vote: 0,
            topic: {
                id: vote.post.topic.id,
                title: vote.post.topic.title,
                display_title: vote.post.topic.display_title
            }
        };
    }

    async postCommentUpvote(user: SerializedUser, commentId: number) {
        const vote = await this.prismaService.vote.findFirst({
            where: {
                comment_id: commentId,
                user_id: user.id
            }
        });

        if (vote) {
            await this.prismaService.vote.update({
                where: {
                    id: vote.id
                },
                data: {
                    value: 1
                }
            });
        } else {
            await this.prismaService.vote.create({
                data: {
                    comment_id: commentId,
                    user_id: user.id,
                    value: 1
                }
            });
        }

        const commentVotes = await this.prismaService.vote.groupBy({
            by: ['comment_id'],
            where: {
                comment_id: commentId
            },
            _sum: {
                value: true
            }
        });

        const votes = commentVotes.find((v) => v.comment_id === commentId);

        return {
            id: commentId,
            _sum: {
                votes: votes?._sum ? votes._sum.value : 0
            },
            user_vote: 1
        };
    }

    async postCommentDownvote(user: SerializedUser, commentId: number) {
        const vote = await this.prismaService.vote.findFirst({
            where: {
                comment_id: commentId,
                user_id: user.id
            }
        });

        if (vote) {
            await this.prismaService.vote.update({
                where: {
                    id: vote.id
                },
                data: {
                    value: -1
                }
            });
        } else {
            await this.prismaService.vote.create({
                data: {
                    comment_id: commentId,
                    user_id: user.id,
                    value: -1
                }
            });
        }

        const commentVotes = await this.prismaService.vote.groupBy({
            by: ['comment_id'],
            where: {
                comment_id: commentId
            },
            _sum: {
                value: true
            }
        });

        const votes = commentVotes.find((v) => v.comment_id === commentId);

        return {
            id: commentId,
            _sum: {
                votes: votes?._sum ? votes._sum.value : 0
            },
            user_vote: -1
        };
    }

    async postCommentResetVote(user: SerializedUser, commentId: number) {
        const vote = await this.prismaService.vote.findFirst({
            where: {
                comment_id: commentId,
                user_id: user.id
            }
        });

        if (vote) {
            await this.prismaService.vote.update({
                where: {
                    id: vote.id
                },
                data: {
                    value: 0
                }
            });
        } else {
            await this.prismaService.vote.create({
                data: {
                    comment_id: commentId,
                    user_id: user.id,
                    value: 0
                }
            });
        }

        const commentVotes = await this.prismaService.vote.groupBy({
            by: ['comment_id'],
            where: {
                comment_id: commentId
            },
            _sum: {
                value: true
            }
        });

        const votes = commentVotes.find((v) => v.comment_id === commentId);

        return {
            id: commentId,
            _sum: {
                votes: votes?._sum ? votes._sum.value : 0
            },
            user_vote: 0
        };
    }
}
