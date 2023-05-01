import { prisma } from './index';

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
  await upsertBehaviours();
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
