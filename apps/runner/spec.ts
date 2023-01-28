import { test, expect, Locator, Page, PlaywrightWorkerOptions, PlaywrightWorkerArgs, PlaywrightTestArgs, PlaywrightTestOptions } from "@playwright/test";

// //precondition
// // Given
// ("I am on the <location>");
// ("I am logged in as <actor>");

// // actions
// // When/And
// ("I click the <selector>");
// ("I type in the <selector>");
// // 'I select <option> option from the <selector>'
// ("I drag <selector> to <destination>");

// // assertion
// // Then
// ("I am directed to <location>"); // LocationDirect
// ("the <selector> should (not) be displayed");
// ("the <selector> should (not) contain the text <text>");
// ("the <selector> should be checked");

// 1. json põhjal feature scenariode testi runnimine
// 2. iga feature, scenario, stepi success/fail staatuse pushimine


const environments = [
    { name: 'local', value: 'http://localhost' },
]

const location = [
    { name: "login page", value: "/login" },
    { name: "assignments page", value: "/assignments" },
];

// type ParamType = 'selector' | 'text' | 'location'


const selectors = [
    { name: "email field", value: "[data-test=login-email-field]", page: '' },
    { name: "password field", value: "[data-test=login-password-field]", page: '' },
    { name: 'login button', value: "[data-test=login-submit]", page: '' }
];


const texts = [
    { name: "my student email", value: "mystudentemail@email.com" },
    { name: "my student password", value: "topsecret" },
];

interface InsertTextStep extends Step {

}

// type Step = {
//     name: 'I fill the <selector> with <text>';
//     type: 'insert-text',
//     params: [StepParam<"selector">, StepParam<"text">]
// } | {
//     name: 'the <selector> should contain the text <text>'
//     type: 'assert-text',
//     params: [StepParam<"selector">, StepParam<"text">]
// } | {
//     name: 'the <selector> should not contain the text <text>'
//     type: 'assert-text-negate',
//     params: [StepParam<"selector">, StepParam<"text">]
// } | {
//     name: 'the <selector> should be displayed'
//     type: 'assert-visibility',
//     params: [StepParam<"selector">]
// } | {
//     name: 'the <selector> should not be displayed'
//     type: 'assert-visibility-negate',
//     params: [StepParam<"selector">]
// }

interface Param {
    type: 'selector' | 'text' | 'location'
    name: string
    value: string
}


type Behaviour = 'navigate' | 'insert-text' | 'assert-text' | 'assert-text-negate' | 'assert-visibility' | 'assert-visibility-negate' | 'assert-location'

interface Step {
    name: string
    behaviour: Behaviour
    params: Param[]
}

const step = {
    name: 'I fill the selector with value',
    type: 'insert-text',
    // selector:
}


interface Feature {
    name: string;
    scenarios: {
        name: string
        steps: Step[];
    }[]
}

const feature: Feature = {
    name: "User authentication",

    scenarios: [{
        name: 'Student can log in',
        steps: [
            {
                name: "I am on the <location>",
                behaviour: 'navigate',
                params: [
                    {
                        type: "location",
                        name: "login page",
                        value: "/login",
                    },
                ],
            },
            {
                name: "I fill the <selector> with <text>",
                behaviour: 'insert-text',
                params: [
                    {
                        type: "selector",
                        name: "email field",
                        value: "[data-test=login-email-field]",
                    },
                    {
                        type: "text",
                        name: "my student email",
                        value: "mystudentemail@email.com",
                    },
                ],
            },
            {
                name: "I fill the <selector> with <text>",
                behaviour: "insert-text",
                params: [
                    {
                        type: "selector",
                        name: "password field",
                        value: "[data-test=login-password-field]",
                    },
                    {
                        type: "text",
                        name: "my student password",
                        value: "supersecretpassw0rd",
                    },
                ],
            },
            {
                name: "I am directed to <location>",
                behaviour: "assert-location",
                params: [
                    {
                        type: "location",
                        name: "assignments page",
                        value: "/assignments",
                    },
                ],
            },
        ],
    },
    {
        name: 'Teacher can log in',
        steps: [
            {
                name: "I am on the <location>",
                behaviour: 'navigate',
                params: [
                    {
                        type: "location",
                        name: "login page",
                        value: "/login",
                    },
                ],
            },
            {
                name: "I fill the <selector> with <text>",
                behaviour: 'insert-text',
                params: [
                    {
                        type: "selector",
                        name: "email field",
                        value: "[data-test=login-email-field]",
                    },
                    {
                        type: "text",
                        name: "my teacher email",
                        value: "teacheemail@email.com",
                    },
                ],
            },
            {
                name: "I fill the <selector> with <text>",
                behaviour: "insert-text",
                params: [
                    {
                        type: "selector",
                        name: "password field",
                        value: "[data-test=login-password-field]",
                    },
                    {
                        type: "text",
                        name: "my teacher password",
                        value: "supersecretpassw0rd",
                    },
                ],
            },
            {
                name: "I am directed to <location>",
                behaviour: "assert-location",
                params: [
                    {
                        type: "location",
                        name: "student groups page",
                        value: "/groups",
                    },
                ],
            },
        ],
    }
    ]

};

export function testFeature() {
    test.describe(feature.name, () => {

        for (const scenario of feature.scenarios) {
            test(scenario.name, async () => {
                for (const [index, step] of scenario.steps.entries()) {
                    await test.step(`${index + 1}. ${replaceStepParams(step)}`, async () => {
                        expect(true).toBe(true)
                    });
                }
            })
        }
    })
}


function replaceStepParams(step: Step) {
    const getParamName = (type: Param['type']) => step.params.find(p => p.type === type)?.name

    return step.name
        .replace('<selector>', getParamName('selector') || 'selector doesnt exist')
        .replace('<location>', getParamName('location') || 'location doesnt exist')
        .replace('<text>', getParamName('text') || 'text doesnt exist')
    // .replace('<value>', getParamName('value') || 'value doesnt exist')
}
// testFeature(feature)

// test.describe(testFeature)
testFeature()