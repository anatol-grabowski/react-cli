# react-cli

## Installation
`npm i -g @grabantot/react-cli`

## Usage
```
Usage: react-cli [options] <path/Component>

Options:
  -V, --version  output the version number
  -f, --func     create/convert to functional component
  -c, --class    create/convert to class component
  -s, --style    create style module and add to component
  -h, --help     output usage information
```

## Todo
Support for custom templates and settings (files extensions, code style).

Options:
```
  -i, --index       add component export to index.js in its directory
  -p, --prop-types  find props used in render and add propTypes for them
  -S, --story       create storybook story for the component
  --semi            add semicolons where needed
```

## Assumptions
- Components are default exports in files
- Functional components are defined as `function ComponentName(props)`
- ...

## Contribute
It's 2019 and still there is no decent react cli. Yet all the appropriate names for such a package on npm are taken.

Lets fix this.
Contributions of any kind are welcome: add features, add tests, refactor the code or simply share you thoughts in issues.