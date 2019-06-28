# react-cli

## Installation
`npm i -g @grabantot/react-cli`

or

`yarn global add @grabantot/react-cli`

## Usage
![animation gif](https://media.giphy.com/media/3kx9XtMByFREQBkfEo/giphy.gif)

``` bash
Usage: react-cli [options] [command] <path/Component>

Manage react components and related files

Options:
  -V, --version  output the version number
  -f, --func     create functional component or convert the existing class component to functional
  -c, --class    create class component or convert the existsing functional component to class
  -s, --style    create style module and add 'import styles' to the component
  -i, --index    add component export to index.js in its directory
  -h, --help     output usage information

Commands:
  config <path>  set directory for templates and config file; will be filled with defaults if empty

Global config location: '/home/tot/.react-cli/config.json'.

Examples:
  $ react-cli -fs src/components/views/Primitives/Button
  $ react-cli -csi src/components/views/User/UserCard
  $ react-cli config path/to/empty/dir/to/put/react-cli-config-and-templates
```

Config options (`react-cli.config.json`):

``` json
{
  "useSemicolons": false,
  "componentExtension": ".js",
  "styleModuleExtension": ".module.scss"
}
```

## Todo
Per directory configs.
Configurable names for templates.

Commands:
- mv - move/rename the component and related files, fix imports in the project

Options:

``` javascript
  -p, --prop-types  // find props used in render and
                    // add propTypes for them
  -r, --redux       // connect the component to the redux store
  -S, --story       // create storybook story for the component
  -P, --pure        // make the component pure
                    // (use recompose's pure for functional components)
  -t, --test        // add tests for the component
```

## Assumptions
- Components are default exports in files
- Functional components are defined as `function ComponentName(props)`
- ...

No assumptions about the project structure.

## Developing

#### Quick setup script
``` bash
git clone https://github.com/grabantot/react-cli.git
cd react-cli
yarn
```

#### Running in dev
`yarn compile` - compiles using the TS compiler with the current config.

`yarn watch` - is the same as above but uses Nodemon to watch changes.

`yarn [options] [command] <path/Component>` - Uses the cli from the build folder to execute commands.

## Contribute

It's 2019 and still there is no decent react cli. Yet all the appropriate names for such a package on npm are taken.

Let's fix this.
Contributions of any kind are welcome: add features, add tests, refactor the code or simply share you thoughts in issues.

Recently converted to Typescript, there are still many `any`'s and `@tsignore`'s, which we'll be fixing as we go. It should still work as we've just added types and changed co

## Related projects
- [reacli](https://www.npmjs.com/package/reacli) - the most similar project
- [rcli](https://www.npmjs.com/package/rcli) - too complicated
- [rcli-tools](https://www.npmjs.com/package/rcli-tools) - makes assumptions about the project structure
- [hileix-rcli](https://www.npmjs.com/package/hileix-rcli) - seems like it can create components
- [reactjs-cli](https://www.npmjs.com/package/reactjs-cli) - can create components
- [create-reactjs-component](https://www.npmjs.com/package/create-reactjs-component)
- [react.cli](https://www.npmjs.com/package/react.cli) - for React-Redux-Boilerplate
- [basic-react-cli](https://www.npmjs.com/package/basic-react-cli)

Less related:
- [create-react-app](https://www.npmjs.com/package/create-react-app) - Create React App
- [cli-react](https://www.npmjs.com/package/cli-react) - only creates the initial project layout
- [react-cli](https://www.npmjs.com/package/react-cli) - not sure what it does
- [reactcli](https://www.npmjs.com/package/reactcli) - dead
- [reactit](https://www.npmjs.com/package/reactit)
- [reactclinext](https://www.npmjs.com/package/reactclinext)
- [reactjs-generator-cli](https://www.npmjs.com/package/reactjs-generator-cli)
- [create-react-component-with-no-config](https://www.npmjs.com/package/create-react-component-with-no-config)
- [fz-react-cli](https://www.npmjs.com/package/fz-react-cli)
- [create-react-cli](https://www.npmjs.com/package/create-react-cli)