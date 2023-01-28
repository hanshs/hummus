# HUMMUS

Hummus is a popular Middle Eastern dish that is made from ground chickpeas and a variety of spices and flavors. It suggests a mix of different elements working together to create a cohesive whole.

## About

```
.github
  └─ workflows
        └─ CI
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ manager
      ├─ Next.js 13
      ├─ React 18
      ├─ TailwindCSS
      └─ E2E typesafe API server & client
packages
 ├─ api
 |   └─ tRPC v10 router definition
 ├─ auth
     └─ authentication using next-auth
 └─ db
     └─ typesafe db-calls using Prisma
```

## Quick Start

To get it running, follow the steps below:

### Setup dependencies

```diff
# Install dependencies
yarn

# In packages/db/prisma update schema.prisma provider to use sqlite
# or use your own database provider
- provider = "postgresql"
+ provider = "sqlite"

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Prisma schema to your database
yarn db:push
```

### Planetscale

#### Useful

start planetscale proxy
`pscale auth login`
`pscale connect hummus <branch> --port 3309`
`pscale branch list hummus`
