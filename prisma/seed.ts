import { prisma } from '@/lib/prisma';
import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

// import { authClient } from "@/lib/auth-client"; //import the auth client
//  const { data, error } = await authClient.signUp.email({
//         email: 'admin@acme.com', // user email address
//         password: '12345678', // user password -> min 8 characters by default
//         name: 'Admin', // user display name
//         callbackURL: "" 
//     }, {
//         onError: (ctx) => {
//             // display the error message
//             console.error('Error: ', ctx.error.message);
//         },
// });


const fakedPosts: Prisma.PostUncheckedCreateWithoutAuthorInput[] = [];
for (let index = 0; index < 500; index++) {
  const post: Prisma.PostUncheckedCreateWithoutAuthorInput = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(5),
    published: true,

  };
  fakedPosts.push(post)
}

const user: Prisma.UserCreateInput = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  posts: {
    create: fakedPosts
  },
  emailVerified: true,
};

export async function main() {
  await prisma.user.create({ data: user });
}

main();
