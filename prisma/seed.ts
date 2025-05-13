import type { Prisma } from "@prisma/client";

import prisma from "~/lib/prisma";

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@acme.co",
    posts: {
      create: [
        {
          title: "Join the Prisma Discord",
          content: "https://pris.ly/discord",
          published: true,
        },
        {
          title: "Prisma on YouTube",
          content: "https://pris.ly/youtube",
          published: true,
        },
      ],
    },
    emailVerified: true,
  },
  {
    name: "Bob",
    email: "bob@acme.co",
    posts: {
      create: [
        {
          title: "Follow Prisma on Twitter",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
      ],
    },
    emailVerified: false,
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
