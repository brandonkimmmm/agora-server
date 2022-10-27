import { faker } from '@faker-js/faker';

const data: {
    title: string;
    description: string;
    display_title?: string;
    image_url?: string;
    posts: {
        title: string;
        body: string;
        comments?: {
            body: string;
        }[];
    }[];
}[] = [
    {
        title: 'NBA',
        description: 'On everything about the NBA',
        image_url:
            'https://a4.espncdn.com/combiner/i?img=%2Fi%2Fespn%2Fmisc_logos%2F500%2Fnba.png',
        posts: [
            {
                title: 'LeBron signing with Lakers.',
                body: 'LeBron James has agreed to 4-year, $154M deal with Lakers, Klutch Sports says.',
                comments: [
                    {
                        body: 'Lakers 2024 champs confirmed'
                    }
                ]
            },
            {
                title: 'Luka is 11/16 FG on shots to tie or take the lead in the clutch.',
                body: 'Luka is 11/16 FG on shots to tite or take the lead in the clutch. Just a stat I heard during the Mavericks game...',
                comments: [
                    {
                        body: 'Future MVP'
                    },
                    {
                        body: 'Still overrated'
                    },
                    {
                        body: 'GOAT confirmed'
                    }
                ]
            },
            {
                title: 'Victor Oladipo should sing the national anthem for the All Star game',
                body: 'Former All Star Victor Oladipo should sing at the national anthem at the all star game. He sang at the 2018 NBA awards and is quite talented'
            }
        ]
    },
    {
        title: 'FITNESS',
        display_title: 'Fitness',
        description: 'A community of fitness enthusiast',
        posts: [
            {
                title: 'Will my biceps grow from doing pullups?',
                body: "I do mostly preacher curls and 21's for biceps but I want to add another accessory lift. Will pullups help grow my biceps or is there another more beneficial exercise?",
                comments: [
                    {
                        body: "Pullups work your back and bicepts. They'll help, but there are better exercises if you just want to focus on biceps"
                    },
                    {
                        body: faker.lorem.sentences(3)
                    }
                ]
            }
        ]
    },
    {
        title: 'FANTHEORIES',
        display_title: 'FanTheories',
        description: 'I noticed...',
        posts: [
            {
                title: 'Willy Wonka did not give Charlie the factory as a reward. It was a punishment just like he gave to all the other childre, except this one was the worst of all.',
                body: 'Owning and running the factory was not a positive experience for Wonka. It took a very obvious toll on his mental health and made him basically unable to interact with other people.',
                comments: [
                    {
                        body: faker.lorem.sentences(3)
                    }
                ]
            }
        ]
    },
    {
        title: 'WEBDEV',
        display_title: 'webdev',
        description: 'Learn and grow as web developers',
        image_url:
            'https://styles.redditmedia.com/t5_2qs0q/styles/communityIcon_kxcmzy9bt1381.jpg',
        posts: [
            {
                title: "Friendly reminder to update your website's year in the footer to 2023",
                body: 'Or better yet, write two lines of code to auto update it to the current year'
            }
        ]
    }
];

export default data;
