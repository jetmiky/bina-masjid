# Bina Masjid Digital

This repository contains both website and API for Bina Masjid Digital, a project for Web Business Application Development.

## :factory: Requirements

- **Code Editor**, recommended to use [Visual Studio Code](https://code.visualstudio.com/).
- **[NodeJS and Node Package Manager (NPM)](https://nodejs.org/en/download/current)** as JavaScript Runtime Environment.
- **[Git](https://git-scm.com/downloads)** as Version Control System, and GitHub Account ofc. _Optionally_, we can also install **Github Desktop**. :sunglasses:

## :pill: Preparation

### Setup Git

- Create an account in **[Github](https://www.github.com)**.
- Open Windows command prompt or Mac terminal.
- Run Git version check, to ensure Git has been installed properly.

```
git version
```

- Set your name.

```
git config --global user.name "<your_name>"
```

- Set your email.

```
git config --global user.email "<your_github_email>"
```

- Setup Github Personal Token. Open [token settings page](https://github.com/settings/tokens).
    1. Generate new token (Classic).
    2. Fill notes field.
    3. In scopes field, check all `repo` scope.
    4. Save the generated personal token. Don't worry we can regenerate again if loses the token.

---

## :cd: Initialization

### Clone Repository

- Open Windows command prompt or Mac terminal.
- Navigate to directory which you want to put this project into. Find reference in Google of the `cd` and `mkdir` command usage.

- Clone this repository.

```
git clone https://github.com/jetmiky/bina-masjid.git
```

- Enter your Github username.
- Enter the personal access token generated earlier as password.

### Install Dependencies

- Redirect to project page.

```
cd bina-masjid
```

- Run NPM version check, to ensure NPM has been installed properly.

```
npm --version
```

- Install NPM dependencies.

```
npm install
```

---

## :video_game: Development

After completing the initialization steps, you only have to start Firebase Emulators everytime starting development.
Why is that necessary? To make sure that it won't affect the production API usage, databases, etc.

```
cd functions
npm run serve
```

- Open the application in the browser, by default its address should be _http://localhost:5500/public_

### Development collaboration

#### Pull latest code respository

Each time before start developing, sync latest code from Github and your local repository.

```
git pull
```

#### Commit changes

After writing some code and feels that they are okay and smooth, commit them to make a checkpoint.

```
git add <files>

// or below to stage all files changed

git add .

// commit changes
git commit -m "<description>"
```

#### Push to Github

When it's time to log off from development, push your code to Github.

```
// first time a branch pushed to Github
git push --set-upstream origin <branch_name>

// branch has been pushed to Github before
git push
```

## :fire: Quotes

> Programming is not about what you know; it's about what you can figure out.

> Any programmer can write code that computer can understand. Great programmers write code that humans can understand.

> Programming is a skill best acquired by practice and example rather than from books.

> Everybody should learn to program a computer; because it teaches how to think.
