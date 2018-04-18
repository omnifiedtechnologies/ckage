# ckage

C影 - Language-agnostic package and project manager

## Usage

First, install it with `npm i ckage -g` to install it globally.

```
  Usage: ckage [options]

  Options:

    -V, --version          output the version number
    i, install [pkg]       Install a package; specify no package to install from ckage.json
    -s, --save             Save into the ckage file along with install
    -d, --dir <directory>  Specify a custom package out directory
    -h, --help             output usage information
```


ckage, like npm, allows you to have a manifest file (`ckage.json`) which makes it easier to specify dependencies in a project. When installing a package, specify the `--save` flag to add the package into your manifest file.

By default, ckage uses the `ckage/` folder for packages. 