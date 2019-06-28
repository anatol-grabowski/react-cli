# Notes (Wayne)

+ create more templates
+ dynamically generate templates based on flags
+ config file in project directory

## `react-cli` design architecture

I feel like making this similar to Angular might be the way to go.
Although Angular as a framework sucks balls,
they got the CLI pretty close to perfect.

It would be great for people coming from React to Ng and vice-versa. 

`react-cli` could even be shortened to `react`, as React don't have a cli.

``` bash
react generate component [options] components/friendly-button
# or
react g c [options] components/friendly-button

react convert components/friendly-button class|function|pure
# or
react c components/friendly-button [c|f|p]
```
## Config ideas

Allow project configs in the following formats:
+ package.json
+ *.json
+ *.js
+ *.yml, *.yaml

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

    "language": "js"|"ts"|"javascript"|"typescript"
    // file extensions - overidden by language flag
    "componentExtension": string,   // commonly [".js"|".tsx"]
    "indexExtension": string,       // commonly [".js"|".ts"]   
    "styleModuleExtension": string, // commonly [".module.css"|".module.scss"|".module.sass"]
    "styleExtension": string,       // commonly [".css"|".scss"|".sass"]
    
    // modules
    "importType": [["require"|"es5"] | ["import"|"es6"|"commonjs"]] // require() or import
}
```