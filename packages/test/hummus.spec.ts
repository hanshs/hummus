import { test, expect } from '@playwright/test';
// import fs from 'fs/promises';
import project from './generated.json';
import { Project, testProject } from './src/runners';

// An import assertion in a dynamic import
// const { default: project } = await import("./generated.json", {
//     assert: {
//         type: "json",
//     },
// });

const projectTest = test.extend<{ project: Project }>({
  project,
});

testProject(project);
// })
// projectTest('Project should conform to requirements', ({ project }) => {
//     // testProject(project)
// })
