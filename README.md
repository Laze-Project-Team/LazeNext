# Laze

Laze is the programming language which doesn't require any preparation and can be written in your own native language.
[Try it now!](http://laze.ddns.net)

## Table of contents

- [Laze features](#laze-features)
- [Join Laze](#join-laze)
- [Contribute to Laze](#contribute-to-laze)
- [For developers](#for-developers)

## Laze features

Laze has two main features.

### Native Language Programming

It is a feature that allows users to write programs in multiple languages such as Japanese and English, not programming languages.

Furthermore, it is our goal to make it possible for anyone to write programs in their native language by implementing functions in the library that can easily support multiple languages

### Without Environment Construction

We are currently developing an editor that functions in a browser. We are trying to further create extensions for offline editors like Visual Studio Code to create an environment where users can develop offline.

We are aming to reduce complicated steps and make the environment quick and easy to build.

* [Official Laze Website](http://laze.ddns.net)
* [Online Editor](https://laze.ddns.net/editor)
* [Online Documentation](https://laze.ddns.net/docs)

## Join Laze

### Join Laze community

Let's ask and answer questions in [the discord community](https://discord.gg/K3prMrmS7e) to keep the community engaged. A thriving community leads to a thriving language itself.

## Contribute to Laze

There are many things you can do, such as writing Laze standard libraries, reporting bugs, suggesting improvements, etc. Laze is still a developing language, so let's make Laze even better with your help.

We are welcomeing any reports, requests, suggestions through issue, [Twitter](https://twitter.com/LazeProjectTeam), [Laze comunity](https://discord.gg/K3prMrmS7e).

### Bug report

Please explain a situation that causes the bug with your environment as detailed as possible. (e.g. Operating System) We are going to solve it as soon as possible.

### Request

We are welcoming any requests or suggestions about the compiler or website or editor. Please send with why you want it.

## For developers

### Technology stack (libraries)

- website
  - Next.js (main framework)
  - Ant Design (UI framework)
  - next-i18next (i18n)
  - monaco-editor (editor)
- dev
  - TypeScript (main programming language)
  - Prettier (code formatter)
  - ESLint (code checker)
  - Tailwind CSS (styling)

※this repository is based on [s-kawabe/next-ts-template](https://github.com/s-kawabe/next-ts-template)

### Quick start for developers

You have to install [Node.js](https://nodejs.org/ja/) and [Git](https://git-scm.com/) to set up the environment.

Clone this repository.

```bash
git clone ~~~
cd ~~~
```

Install yarn (if you have not installed it yet)

```bash
npm i --global yarn
```

Install necessary libraries

```bash
yarn
```

Get Laze compiler and write its absolute path to `COMPILER_PATH` in `.env` (copy `.env.template`).

**commands**

`yarn dev` to run development server

`yarn build` to build project

`yarn start` to start production server (require build)
