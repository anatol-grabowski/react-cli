# react-cli

## Installation
`npm i -g @grabantot/react-cli`

## Usage
```
Usage: react-cli [options] <path/Component>

Options:
  -V, --version  output the version number
  -f, --func     create functional component or convert the existing class component to functional
  -c, --class    create class component or convert the existsing functional component to class
  -s, --style    create style module and add import to the component
  -h, --help     output usage information

Examples:
  $ react-cli -fs src/components/views/Primitives/Button
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

No assumptions about the project structure.

## Contribute
It's 2019 and still there is no decent react cli. Yet all the appropriate names for such a package on npm are taken.

Lets fix this.
Contributions of any kind are welcome: add features, add tests, refactor the code or simply share you thoughts in issues.

## Related projects
- [reacli](https://www.npmjs.com/package/reacli) - the most similar project
- [rcli](https://www.npmjs.com/package/rcli) - too complicated
- [rcli-tools](https://www.npmjs.com/package/rcli-tools) - makes assumptions about the project structure
- [hileix-rcli](https://www.npmjs.com/package/hileix-rcli) - seems like it can create components
- [reactjs-cli](https://www.npmjs.com/package/reactjs-cli) - can create component
- [create-reactjs-component](https://www.npmjs.com/package/create-reactjs-component)

Less related:
- [create-react-app](https://www.npmjs.com/package/create-react-app) - Create React App
- [cli-react](https://www.npmjs.com/package/cli-react) - only creates the initial project layout
- [react-cli](https://www.npmjs.com/package/react-cli) - not sure what it does
- [reactcli](https://www.npmjs.com/package/reactcli) - dead
- [reactit](https://www.npmjs.com/package/reactit)
- [reactclinext](https://www.npmjs.com/package/reactclinext)
- [reactjs-generator-cli](https://www.npmjs.com/package/reactjs-generator-cli)
