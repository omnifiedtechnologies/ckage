# ckage

C影 - Language-agnostic package and project manager

## Usage

First, install it with `$ npm i ckage -g` to install it globally.

```
  Usage: ckage [options]

  Options:

    -V, --version          output the version number
    -s, --save             Save into the ckage file along with install
    -d, --dir <directory>  Specify a custom package out directory
    p, publish             Publish to the repository
    i, install [pkg]       Install a package; specify no package to install from ckage.json
    -h, --help             output usage information
```


ckage, like npm, allows you to have a manifest file (`ckage.json`) which makes it easier to specify dependencies in a project. When installing a package, specify the `--save` flag to add the package into your manifest file.

Manifest files appear as follows:
```json
{
    "packageTitle": "your-title-no-spaces",
    "sourceDirs": [
        "src",
        "anything-can-go-here"
    ],
    "fileIgnores": [
        "node_modules",
        "any-other-file-to-ignore"
    ],
    "creator": "Name <ben@july7.pw>"
}

```

By default, ckage uses the `ckage/` folder for packages.

The global config file for ckage exists at `~/.ckage.json`.

```json
{
        "token": "YOUR_LOGIN_TOKEN_FOR_CKAGE"
}
```

## Why?

It may not be clear why we would build yet another package manager. There are so many and yet we built another one, why?

The purpose of Ckage is to provide an incredibly lightweight solution to *internal* package management. At a company, you don't want to have to deal with dependency conflicts.

Furthermore, let's say I want to create an internal node module to use across multiple projects but I don't want to make this code published. What can I do? well with Ckage that's simple. You simply point the package manager at your own custom instance. Ckage is distributed, you can host an instance if you so please.

Let's again assume that an NPM package becomes compromised. You shouldn't be concerned about updating the packages you have because each package should be *individually* checked for security or dependency conflicts before being checked in.

The purpose of Ckage is to get red of all of those uncontrollable variables you have when you use a public package manager.