# Notes (Wayne)

+ create more templates
+ dynamically generate templates based on flags
+ config file in project directory

## `react-cli` design architecture

I feel like making this similar to Angular might be the way to go.
Although Angular as a framework sucks balls,
they got the CLI pretty close to perfect.

It would be great for people coming from React to Ng and vice-versa. 

``` bash
react-cli generate component [options] components/friendly-button
# or
react-cli g c [options] components/friendly-button
```
## Config ideas

Allow project configs in
+ package.json
+ *.json
+ *.js
+ *.yml, *.yaml
+

Might be worth extending these.

I think doing `[class|function|pure]Component: { setting: value, ... }` is teh way to go.
That way all components have global settings, and can also have unique ones to override global if required.

``` jsx
{
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
        functions: "const"|"function",
        lifecycleMethods: boolean,
    }    
    // functional component
    "functionComponent": {
        type: "const"|"function",
        functions: "const"|"function",
        useState: boolean,
        useEffect: boolean,
    }
    // pure component
    "pureComponent": {
        type: "const"|"function",
        functions: "const"|"function"
    }
    // formatting - plugins from ESlint & Prettier 
    "formatPlugins": ("eslint"|"prettier")[]
    "useSemicolons": boolean,

    // files & folders
    "templates": string[],          // any amount of directories
    "srcDirectory": "string",       // commonly ["src", "lib"]

    // file extensions
    "componentExtension": string,   // commonly [".js"|".tsx"]
    "indexExtension": string,       // commonly [".js"|".ts"]   
    "styleModuleExtension": string, // commonly [".module.css"|".module.scss"|".module.sass"]
    "styleExtension": string,       // commonly [".css"|".scss"|".sass"]
    
    // modules
    "importType": [["require"|"es5"] | ["import"|"es6"|"commonjs"]] // require() or import
    "language": "javascript"|"typescript"
}
```