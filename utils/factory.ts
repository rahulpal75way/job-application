// common/utils/factory.ts
import { faker } from "@faker-js/faker";

export const userFactory = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: "user123",
  role: "CANDIDATE",
});

export const jobFactory = (postedById: string) => ({
  title: faker.person.jobTitle(),
  description: faker.lorem.paragraph(),
  postedById,
});
