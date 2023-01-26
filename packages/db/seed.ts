

import { prisma } from './index'
import bcrypt from 'bcrypt'

async function empty() {
    await prisma.project.deleteMany()
    await prisma.user.deleteMany()
    await prisma.feature.deleteMany()
    await prisma.scenario.deleteMany()
    await prisma.step.deleteMany()
    await prisma.param.deleteMany()
    await prisma.paramType.deleteMany()
    await prisma.behaviour.deleteMany()
    await prisma.userOnProject.deleteMany()
}


const paramType = {
    location: 'location',
    selector: 'selector',
    text: 'text'
}

const steps = [
    {
        behaviour: 'I am on <location>',
        params: [{ name: 'login page', value: '/login', type: paramType.location }]
    },
    {
        behaviour: 'I fill the <selector> with <text>',
        params: [
            { name: 'username field', value: '[data-test="username-field"]', type: paramType.selector },
            { name: 'my username', value: 'testuser', type: paramType.text }
        ]
    },
    {
        behaviour: 'I fill the <selector> with <text>',
        params: [
            { name: 'password field', value: '[data-test="password-field"]', type: paramType.selector },
            { name: 'my password', value: 'mypassword', type: paramType.text }
        ]
    },
    {
        behaviour: 'I click on <selector>',
        params: [{ name: 'login button', value: '[data-test="login-button"]', type: paramType.selector }]
    },
    {
        behaviour: 'I am directed to <location>',
        params: [{ name: 'dashboard page', value: '/dashboard', type: paramType.location }]
    }
]
async function upsertParamTypes() {
    const transactions = []

    for (const type in paramType) {
        transactions.push(
            prisma.paramType.upsert({
                where: { type },
                create: { type },
                update: {}
            })
        )
    }

    await prisma.$transaction(transactions)
}
async function upsertParams() {
    const transactions = []

    for (const step of steps) {
        for (const param of step.params) {
            transactions.push(
                prisma.param.upsert({
                    where: { value: param.value },
                    create: { name: param.name, value: param.value, type: { connect: { type: param.type } } },
                    update: {}
                })
            )
        }
    }

    return await prisma.$transaction(transactions)
}

async function upsertBehaviours() {
    const transactions = []

    for (const step of steps) {
        transactions.push(
            prisma.behaviour.upsert({
                where: { value: step.behaviour },
                create: { value: step.behaviour },
                update: {}
            })
        )
    }

    return await prisma.$transaction(transactions)
}
async function seed() {
    await empty()
    await upsertParamTypes()
    await upsertParams()
    await upsertBehaviours()
    const user = await prisma.user.upsert({
        where: { username: 'testman' },
        create: {
            username: 'testman',
            password: await bcrypt.hash('topsecret', 10),
        },
        update: {}
    })

    const project = await prisma.project.upsert({
        where: { id: 'seed-project-id' },
        create: {
            id: 'seed-project-id',
            name: 'Seed project',
            users: { create: { userId: user.id } },
        },
        update: {}
    })

    const feature = await prisma.feature.upsert({
        where: { id: 'seed-feature-id' },
        create: {
            id: 'seed-feature-id',
            title: 'Seed feature',
            description: 'As a user, I want to log into the system, so that I can do logged in user things',
            project: { connect: { id: project.id } }
        },
        update: {}
    })

    await prisma.scenario.upsert({
        where: { id: 1 },
        create: {
            name: 'User can log in',
            steps: {
                create: steps.map((step, index) => ({
                    order: index + 1,
                    behaviour: { connect: { value: step.behaviour } },
                    params: { connect: step.params.map(param => ({ name: param.name })) }
                }))
            },
            feature: { connect: { id: feature.id } }
        },
        update: {}
    })
}
seed()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })