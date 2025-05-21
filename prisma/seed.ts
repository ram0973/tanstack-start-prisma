import { prisma } from '@/lib/prisma';
import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

const fakedPosts: Prisma.PostUncheckedCreateWithoutAuthorInput[] = [];
for (let index = 0; index < 100; index++) {
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
