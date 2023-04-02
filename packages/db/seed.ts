import { Feature, prisma, Project, User } from './index';
import bcrypt from 'bcrypt';

const project = {
  id: 'seed-project-id',
  name: 'Seed project',
};

const feature = {
  id: 'seed-feature-id',
  title: 'Seed feature',
  description: 'As a user, I want to log into the system, so that I can do logged in user things',
};

const behaviours = [
  { id: 'browser-is-location', value: 'I am on <location>' },
  { id: 'browser-directed-to-location', value: 'I should be directed to <location>' },
  { id: 'browser-click-selector', value: 'I click on <selector>' },
  { id: 'browser-fill-selector', value: 'I fill the <selector> with <text>' },
  { id: 'browser-selector-contains-text', value: 'The <selector> should contain the <text>' },
  { id: 'browser-selector-not-contains-text', value: 'The <selector> should not contain the <text>' },
  { id: 'browser-selector-visible', value: 'The <selector> should be visible' },
  { id: 'browser-selector-not-visible', value: 'The <selector> should not be visible' },
];
const paramType = {
  location: 'location',
  selector: 'selector',
  text: 'text',
};
const steps = [
  {
    behaviour: 'browser-is-location',
    params: [{ name: 'login page', value: '/login', type: paramType.location }],
  },
  {
    behaviour: 'browser-fill-selector',
    params: [
      { name: 'username field', value: '[data-test="username-field"]', type: paramType.selector },
      { name: 'my username', value: 'testuser', type: paramType.text },
    ],
  },
  {
    behaviour: 'browser-fill-selector',
    params: [
      { name: 'password field', value: '[data-test="password-field"]', type: paramType.selector },
      { name: 'my password', value: 'mypassword', type: paramType.text },
    ],
  },
  {
    behaviour: 'browser-click-selector',
    params: [{ name: 'login button', value: '[data-test="login-button"]', type: paramType.selector }],
  },
  {
    behaviour: 'browser-directed-to-location',
    params: [{ name: 'projects page', value: '/projects', type: paramType.location }],
  },
];

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

  const user = await upsertUser();
  const project = await upsertProject(user);
  const feature = await upsertFeature(project);

  await upsertBehaviours();
  await upsertParams(feature);
  await upsertScenario(feature);
}

async function deleteEverything() {
  await prisma.param.deleteMany();
  await prisma.step.deleteMany();
  await prisma.behaviour.deleteMany();
  await prisma.scenario.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  console.log('Deleted everything, yikes!');
}

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
            project: { connect: { id: project.id } },
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
    where: { id: project.id },
    create: {
      ...project,
      users: { connect: { id: user.id } },
    },
    update: {},
  });
}

function upsertFeature(project: Project) {
  return prisma.feature.upsert({
    where: { id: feature.id },
    create: {
      ...feature,
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

async function upsertScenario(feature: Feature) {
  await prisma.scenario.upsert({
    where: { id: 1 },
    create: {
      name: 'User can log in',
      feature: { connect: { id: feature.id } },
      steps: {
        create: steps.map((step, index) => ({
          order: index + 1,
          behaviour: { connect: { id: step.behaviour } },
          params: { connect: step.params.map((param) => ({ name: param.name })) },
        })),
      },
    },
    update: {},
  });

  await prisma.scenario.upsert({
    where: { id: 2 },
    create: {
      name: 'User can log in with combined step',
      feature: { connect: { id: feature.id } },
      steps: {
        create: [
          {
            order: 1,
            behaviour: {
              create: {
                value: 'I am logged in as user',
                project: { connect: { id: project.id } },
                subSteps: {
                  create: steps.map((step, index) => ({
                    order: index + 1,
                    behaviour: { connect: { id: step.behaviour } },
                    params: { connect: step.params.map((param) => ({ name: param.name })) },
                  })),
                },
              },
            },
          },
        ],
      },
    },
    update: {},
  });

  // await prisma.behaviour.create({
  //   data: {
  //     value: 'I am logged in as user',
  //     project: { connect: { id: project.id } },
  //     subSteps: {
  //       create: steps.map((step, index) => ({
  //         order: index + 1,
  //         behaviour: { connect: { id: step.behaviour } },
  //         params: { connect: step.params.map((param) => ({ name: param.name })) },
  //       })),
  //     },
  //   },
  // });
}
