# HUMMUS

Hummus is a behaviour-driven specification management and execution system, unlocking collaboration in requirements specification and management activites, without relying on technical tools or Domain Specific Languages (DSL), such as Gherkin. Hummus aims to free developers from DSL and test-suite maintenance and allow all stakeholders to efficiently engage with software specifications and testing activities.

## Features

**Specification Management**

The Hummus **Manager** enables the creation of specifications directly from the UI, eliminating the need for a DSL. Specifications can be created and accessed by logging into the web-based Manager client. This client offers additional maintenance capabilities for composing requirement specifications, including encouraging reusability by providing a selection of granular interactions when creating scenarios. This approach reduces the mental effort needed to determine the exact wording or sequence for scenario steps and prevents errors due to loose grammar, such as distinguishing between "Given I log in to the system" and "Given I log on to the system." Additionally, the ability to combine multiple steps into one for repetitive interactions makes scenarios shorter and more concise.

**Parameter Management**

Parameter management provides a way to store additional context about the system being specified, such as specific elements, locations, or textual values that users of the new system would see or interact with. Parameters are centrally stored within projects, shared across features, and used in scenario steps to specify step behavior. This approach encourages consideration of the specific properties of the designed system before development. Similar to Hummus parameters, these kinds of properties are often abstracted in traditional test suites by developers.

**Test Execution**

Executing the specification using the **Runner** package provides valuable feedback for developers during development, ensuring that proposed changes to the system are beneficial. While concerns about managing test suites might lead to overlooking test automation, the benefits of feedback and security provided by automated acceptance testing are crucial in fast-paced agile software development. The Runner package enables developers to test their work directly during development or in the continuous integration process without requiring additional test code or DSL management. This feedback ensures valuable insights into whether the developed system aligns with its requirements, excluding the subjectivity associated with acceptance testing.


## Advantages

The proposed approach offers several significant advantages:

1. **Elimination of DSL**: Specifications can be created directly from the UI, circumventing the usability issues associated with DSLs and making the process more accessible.
2. **Reduced mental effort**: Selection of granular interactions and parameters simplify the construction of scenarios.
3. **Error prevention**: Loose grammar-related errors are minimized by utilizing a selection of available entities in scenario creation.
4. **Concise scenarios**: The ability to combine multiple steps into one for repetitive interactions makes scenarios shorter and more concise.
5. **Parameter management**: Centrally stored parameters within projects encourage consideration of specific properties before development.
6. **Automated acceptance testing**: The Runner package enables automated acceptance testing without requiring additional test code, providing valuable feedback on adherence to the specification.

## Limitations

Despite the advantages of the proposed approach, there are several limitations that should
be considered:

1. **Limited to web-based software:** As it currently stands, only the software utilizing web technologies and a browser environment can be specified and tested using Hummus. To overcome this limitation, an additional Runner package should be developed, utilizing a testing library that has the ability to automate the desired environment.

2. **Limited to implemented behaviors:** The implemented behaviors might not be sufficient for more complex software products. Additional behaviors could be needed for more complicated interactions, such as dragging and dropping, swiping in mobile environments, or additional assertions for test oracles. Utilizing the selector parameter is very dynamic but might not be enough for more complex use-cases.

3. **Limited access to testing lifecycle:** The nature of acceptance testing, which targets the system’s ends, might be more difficult due to the fact that test code is generated. Access to the lifecycle of testing is limited, such as access to before, after, beforeAll, and afterAll functions. This limitation can be reduced when utilizing Playwright’s globalSetup configuration option, which allows for functionality to be passed that acts before every scenario, potentially needed for tasks like resetting mutable shared states (e.g., a database) or intercepting network traffic when communicating with third-party services beyond the developer’s control.

4. **Limited features in the prototype:** As it currently stands, the Manager client does not enable connecting users to existing projects created by other users. However, this is a feature that can easily be added in the future. Additionally, version control functionality might be necessary to implement in the future, as currently any modifications are instantly reflected when executing the specification. This might discourage making modifications to the specification before the implementation is due to be developed.

## Manager screenshots
![6-add-scenario](https://github.com/hanshs/hummus/assets/19611757/0cd519ec-3d63-416a-9708-bb6292679825)
![7-add-scenario-step](https://github.com/hanshs/hummus/assets/19611757/70690053-6818-4cf9-8f7c-d39a3de04f45)
![10-set-step-param](https://github.com/hanshs/hummus/assets/19611757/f5c849a8-ff9a-49c2-ac71-88eaffe6049c)

## Project structure

```
.github
  └─ workflows
        └─ CI
.vscode
  └─ Recommended extensions and settings for VSCode users
packages
  ├─ manager
  |   └─ Web-based client for managing specifications
  ├─ runner
  |   └─ CLI client for executing specifications
  ├─ api
  |   └─ Facilitates the exchange of data between clients and the database
  ├─ db
  |   └─ Database schema and configuration for storing specifications
  └─ demo
      └─ An example todo app demonstrating the setup for executing specification via runner
```

## Quick Start

To get it running, follow the steps below:

### 1. Setup Node.js

Have at least Node v16+ installed.

```diff
# In case you don't have yarn installed, install it via npm
npm install -g yarn
# Using npm as package manager for this project might not work
```

### 2. Setup dependencies

```diff
# Install dependencies in the root directory
yarn

# In packages/db/prisma update schema.prisma provider to use sqlite
- provider = "mysql"
+ provider = "sqlite"

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the database schema to your database
yarn db:push

# Populate the database with seed data
yarn db:seed


```

### 3. Start everything locally

```diff
yarn dev
```

### When using Planetscale

```diff
# Authenticate using Planetscale CLI client
pscale auth login

# List databases
pscale branch list <database>

# Start Planetscale proxy
pscale connect <database> <branch> --port 3309

# Setup .env, to use the Planetscale proxy
+ DATABASE_URL = "mysql://127.0.0.1:3309/<database>"

# Push the Prisma schema to your database
yarn db:push
```
