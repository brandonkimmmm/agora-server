import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import topics from './topics';

dotenv.config();

const prisma = new PrismaClient();

(async () => {
    try {
        const userIds: number[] = [];

        console.log('Seeding dummy users');
        for (let i = 0; i < 20; i++) {
            const email = faker.internet.email();
            const password = 'ASDFasdf1234!';
            const first_name = faker.name.firstName();
            const last_name = faker.name.lastName();
            const username = email.split('@')[0];

            const user = await prisma.user.upsert({
                where: {
                    email
                },
                update: {},
                create: {
                    email,
                    first_name,
                    last_name,
                    username,
                    role: 'USER',
                    password: bcrypt.hashSync(
                        password,
                        parseInt(process.env.BCRYPT_SALT_ROUNDS as string)
                    )
                }
            });

            userIds.push(user.id);
        }
        console.log('Dummy users seeded');

        console.log('Seeding dummy topics');
        for (const {
            title,
            display_title,
            description,
            image_url,
            posts
        } of topics) {
            const topic = await prisma.topic.upsert({
                where: {
                    title
                },
                update: {},
                create: {
                    title,
                    display_title: display_title || title,
                    description,
                    image_url,
                    user_id: 1
                }
            });

            for (const { title, body, comments } of posts) {
                const post = await prisma.post.create({
                    data: {
                        title,
                        body,
                        topic_id: topic.id,
                        user_id: faker.datatype.boolean()
                            ? 1
                            : userIds[
                                  faker.datatype.number({
                                      min: 0,
                                      max: userIds.length - 1
                                  })
                              ]
                    }
                });

                if (comments) {
                    for (const { body } of comments) {
                        await prisma.comment.create({
                            data: {
                                body,
                                post_id: post.id,
                                user_id:
                                    userIds[
                                        faker.datatype.number({
                                            min: 0,
                                            max: userIds.length - 1
                                        })
                                    ]
                            }
                        });
                    }
                }
            }
        }
        console.log('Dummy topics seeded');
    } catch (err) {
        console.error(err);
    }
})();
