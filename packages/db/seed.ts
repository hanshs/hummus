

import { prisma } from './'

async function seed() {
    // const asd = await prisma.feature.createMany({
    //     data: {}
    // })
    // const actions = prisma.action.createMany({
    //     data: [
    //         {
    //             behaviour: 'I am on <location>',

    //             // params: {
    //             //     create: {
    //             //         type: 'location',
    //             //         name: 'login page',
    //             //         value: '[data-test=login-email-field]'
    //             //     }
    //             // }
    //         }
    //     ]
    // })

    await prisma.feature.create({
        data: {
            title: 'My first feature',
            description: 'This is the feature description',
            scenarios: {
                create: {
                    name: 'This is first scenario',

                    steps: {
                        create: [
                            {
                                action: {
                                    create: {
                                        behaviour: 'I am on <location>',
                                        params: {
                                            create: {
                                                type: 'location',
                                                name: 'login page',
                                                value: '[data-test=login-email-field]'
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                action: {
                                    create: {
                                        behaviour: 'I click <selector>',
                                        params: {
                                            create: {
                                                type: 'selector',
                                                name: 'email field',
                                                value: '[data-test=login-email-field]'
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }

            }
        }
    })
}
seed()