

import { prisma } from './index'

async function seed() {
    const paramTypes = [
        prisma.paramType.upsert({
            where: { type: 'selector' },
            create: { type: 'selector' },
            update: {}
        }),
        prisma.paramType.upsert({
            where: { type: 'location' },
            create: { type: 'location' },
            update: {}
        }),
        prisma.paramType.upsert({
            where: { type: 'text' },
            create: { type: 'text' },
            update: {}
        })
    ]

    await prisma.$transaction([...paramTypes])

    const [loginLocationParam, loginButtonSelectorParam, emailFieldSelectorParam, passwordFieldSelectorParam, emailTextParam, passwordTextParam, dashboardLocationParam] = await prisma.$transaction([
        prisma.param.upsert({
            where: {
                value: '/login',
            },
            create: {
                name: 'login page',
                value: '/login',
                type: {
                    connect: {
                        type: 'location'
                    }
                }

            },
            update: {},
        }),
        prisma.param.upsert({
            where: {
                value: '[data-test="login-button"]',
            },
            create: {
                name: 'login button',
                value: '[data-test="login-button"]',
                type: {
                    connect: {
                        type: 'selector'
                    }
                }
            },
            update: {},
        }),
        prisma.param.upsert({
            where: {
                value: '[data-test="email-field"]',
            },
            create: {
                name: 'email field',
                value: '[data-test="email-field"]',
                type: {
                    connect: {
                        type: 'selector'
                    }
                }
            },
            update: {},
        }),
        prisma.param.upsert({
            where: {
                value: '[data-test="password-field"]',
            },
            create: {
                name: 'password field',
                value: '[data-test="password-field"]',
                type: {
                    connect: {
                        type: 'selector'
                    }
                }
            },
            update: {},
        }),
        prisma.param.upsert({
            where: {
                value: 'mytestemail@email.com',
            },
            create: {
                name: 'my email',
                value: 'mytestemail@email.com',
                type: {
                    connect: {
                        type: 'text'
                    }
                }
            },
            update: {},
        }),
        prisma.param.upsert({
            where: {
                value: 'supersecretpassword',
            },
            create: {
                name: 'my password',
                value: 'supersecretpassword',
                type: {
                    connect: {
                        type: 'text'
                    }
                }
            },
            update: {},
        }),
        prisma.param.upsert({
            where: {
                value: '/dashboard',
            },
            create: {
                name: 'dashboard page',
                value: '/dashboard',
                type: {
                    connect: {
                        type: 'location'
                    }
                }
            },
            update: {},
        })
    ])

    const steps = await prisma.$transaction([
        prisma.action.upsert({
            where: { behaviour: 'I am on <location>' },
            create: {
                behaviour: 'I am on <location>',
                params: {
                    connect: { id: loginLocationParam.id }
                }
            },
            update: {}
        }),
        prisma.action.upsert({
            where: { behaviour: 'I fill the <selector> with <text>' },
            create: {
                behaviour: 'I fill the <selector> with <text>',
                params: {
                    connect: [{ id: emailFieldSelectorParam.id }, { id: emailTextParam.id }]
                }
            },
            update: {}
        }),
        prisma.action.upsert({
            where: { behaviour: 'I fill the <selector> with <text>' },
            create: {
                behaviour: 'I fill the <selector> with <text>',
                params: {
                    connect: [{ id: passwordFieldSelectorParam.id }, { id: passwordTextParam.id }]
                }
            },
            update: {}
        }),
        prisma.action.upsert({
            where: { behaviour: 'I click on <selector>' },
            create: {
                behaviour: 'I click on <selector>',
                params: {
                    connect: { id: loginButtonSelectorParam.id }
                }
            },
            update: {}
        }),
        prisma.action.upsert({
            where: { behaviour: 'I am directed to <location>' },
            create: {
                behaviour: 'I am directed to <location>',
                params: {
                    connect: { id: dashboardLocationParam.id }
                }
            },
            update: {}
        }),
    ])

    const authFeature = await prisma.feature.upsert({
        where: { id: 1 },
        create: { title: 'User authentication', description: 'As a user, I want to log into the system, so that I can do logged in user things' },
        update: {}
    })

    const loginScenario = await prisma.scenario.upsert({
        where: { id: 1 },
        create: {
            name: 'User can log in',
            steps: {
                connectOrCreate: steps.map(step => (
                    {
                        where: { id: step.id },
                        create: {
                            action: {
                                connect: { id: step.id }
                            }
                        }
                    }
                ))
            },
            feature: {
                connect: {
                    id: authFeature.id
                }
            }
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