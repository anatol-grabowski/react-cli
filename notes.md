# Notes (Wayne)

## Todo
+ create more templates
+ dynamically generate templates based on flags
+ config file in project directory
+ vscode extension to detect config file for intellisense

### next steps
+ ??? rest...

## `react-cli` design architecture

I feel like making this similar to Angular might be the way to go.
Although Angular as a framework sucks balls,
they got the CLI pretty close to perfect.

`react [verb|action] [noun|object] [option/s] [directory]`

It would be great for people coming from React to Ng and vice-versa. 

`react-cli` could even be shortened to `react`, as React don't have a cli.

``` bash
react generate component [options] components/friendly-button
# or
react g c [options] components/friendly-button

react convert component components/friendly-button class|function|pure
# or
react c c components/friendly-button c|f|p
```

Check out these options.
``` bash
react \
[generate component|config] \ 
[convert component|functions]
[options] \
<filepath>

```
## Config ideas

Allow project configs in the following formats:
+ package.json
+ *.json
+ *.js
+ *.yml, *.yaml
+ .reactclirc

``` jsx
{
    "templateName": string,
    "defaultTemplate": boolean,
    // components. Set global defaults or override at lower level, such as `classComponent:{ setting: value}`
    "components":{
        default: "class"|"function"|"pure", 
        
        defaultExport: boolean,
        folderPerComponent: boolean,
        functions: "const"|"function",
        fragmentType: "short"|"medium"|"long",   // short: </>, medium: <Fragment/>, long: <React.Fragment />
    }
    // class component
    "classComponent": {
        lifecycleMethods: boolean,
    }    
    // functional component
    "functionComponent": {
        type: "const"|"function",
        useHooks: boolean,
    }
    // pure component
    "pureComponent": {
        type: "const"|"function",
    }
    // formatting - plugins from ESlint & Prettier 
    "formatPlugins": ("eslint"|"prettier")[]
    "useSemicolons": boolean,

    // files & folders
    "templates": string[],          // any amount of directories
    "srcDirectory": "string",       // commonly ["src", "lib"]
    "projectStructure": [           // predefine what your structure normally looks like for poject starts
        "folder1",
        "folder2",
        "folder3": [
            "folder4",
            "folder5",
        ]
    ],

    "reactLanguage": "js"|"ts"|"javascript"|"typescript",
    "styleLanguage": "...",
    // file extensions - overidden by language flag
    "componentExtension": string,   // commonly [".js"|".tsx"]
    "indexExtension": string,       // commonly [".js"|".ts"]   
    "styleModuleExtension": string, // commonly [".module*"] equivelant to "*.module.css"
    "styleExtension": string,       // commonly [".css"|".scss"|".sass"]
    
    // modules
    "importType": [["require"|"es5"] | ["import"|"es6"|"commonjs"]] // require() or import
}
```

## Architecture

What does it do now?
+ Component conversions
+ Config creator
+ copies templates into folders, with options


How do will the this CLi work at a high level?


What might the APi be?
``` typescript
import 'ComponentConvertor' from './Convertor'

const newSource = new Convertor({}).from('sourceCode').to('class|function|')

+ styles, 
```

Well, what parts do we have?
+ Commander descriptions, options, arguments, 
+ Utitilities such as name validation, 
+ CLI options, paths, sources, 