import { Feature, prisma, Project, User } from './index';
import bcrypt from 'bcrypt';

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function seed() {
  await deleteEverything();
  await upsertBehaviours();

  const user = await upsertUser();
  const project = await upsertProject(user);
  const feature = await upsertFeature(project);

  await upsertParams(feature);
  await upsertScenario(feature);
}

async function deleteEverything() {
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.scenario.deleteMany();
  await prisma.step.deleteMany();
  await prisma.param.deleteMany();
  await prisma.behaviour.deleteMany();
  // await prisma.userOnProject.deleteMany();
}

const paramType = {
  location: 'location',
  selector: 'selector',
  text: 'text',
};

const behaviours = [
  { id: 1, value: 'I am on <location>' },
  { id: 2, value: 'I should be directed to <location>' },
  { id: 3, value: 'I click on <selector>' },
  { id: 4, value: 'I fill the <selector> with <text>' },
  { id: 5, value: 'The <selector> should contain the <text>' },
  { id: 6, value: 'The <selector> should not contain the <text>' },
  { id: 7, value: 'The <selector> should be visible' },
  { id: 8, value: 'The <selector> should not be visible' },
];

const steps = [
  {
    behaviour: 1,
    params: [{ name: 'login page', value: '/login', type: paramType.location }],
  },
  {
    behaviour: 4,
    params: [
      { name: 'username field', value: '[data-test="username-field"]', type: paramType.selector },
      { name: 'my username', value: 'testuser', type: paramType.text },
    ],
  },
  {
    behaviour: 4,
    params: [
      { name: 'password field', value: '[data-test="password-field"]', type: paramType.selector },
      { name: 'my password', value: 'mypassword', type: paramType.text },
    ],
  },
  {
    behaviour: 4,
    params: [{ name: 'login button', value: '[data-test="login-button"]', type: paramType.selector }],
  },
  {
    behaviour: 2,
    params: [{ name: 'projects page', value: '/projects', type: paramType.location }],
  },
];

function upsertParams(feature: Feature) {
  const transactions = [];

  for (const step of steps) {
    for (const param of step.params) {
      transactions.push(
        prisma.param.upsert({
          where: { value: param.value },
          create: {
            name: param.name,
            value: param.value,
            type: param.type,
            feature: { connect: { id: feature.id } },
          },
          update: {},
        }),
      );
    }
  }

  return prisma.$transaction(transactions);
}

async function upsertBehaviours() {
  const transactions = [];

  for (const behaviour of behaviours) {
    transactions.push(
      prisma.behaviour.upsert({
        where: { id: behaviour.id },
        create: { id: behaviour.id, value: behaviour.value },
        update: { value: behaviour.value },
      }),
    );
  }

  return await prisma.$transaction(transactions);
}

function upsertProject(user: User) {
  return prisma.project.upsert({
    where: { id: 'seed-project-id' },
    create: {
      id: 'seed-project-id',
      name: 'Seed project',
      users: { connect: { id: user.id } },
    },
    update: {},
  });
}

function upsertFeature(project: Project) {
  return prisma.feature.upsert({
    where: { id: 'seed-feature-id' },
    create: {
      id: 'seed-feature-id',
      title: 'Seed feature',
      description: 'As a user, I want to log into the system, so that I can do logged in user things',
      project: { connect: { id: project.id } },
    },
    update: {},
  });
}

async function upsertUser() {
  const credentials = {
    username: process.env.SEED_USER_USERNAME,
    password: process.env.SEED_USER_PASSWORD,
  };

  if (!credentials.username || !credentials.password) {
    throw new Error('Cannot create seed user, no credentials specified');
  }

  return prisma.user.upsert({
    where: { username: credentials.username },
    create: {
      username: credentials.username,
      password: await bcrypt.hash(credentials.password, 10),
    },
    update: {},
  });
}

function upsertScenario(feature: Feature) {
  return prisma.scenario.upsert({
    where: { id: 1 },
    create: {
      name: 'User can log in',
      steps: {
        create: steps.map((step, index) => ({
          order: index + 1,
          behaviour: { connect: { id: step.behaviour } },
          params: { connect: step.params.map((param) => ({ name: param.name })) },
        })),
      },
      feature: { connect: { id: feature.id } },
    },
    update: {},
  });
}
