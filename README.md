# react-cli

## Usage
```
Usage: index [options] <path/ComponentName>

Options:
  -V, --version  output the version number
  -f, --func     create/convert to functional component
  -c, --class    create/convert to class component
  -s, --style    create style module and add to component
  -h, --help     output usage information
```

## Planned options
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