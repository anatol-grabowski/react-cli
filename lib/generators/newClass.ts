// a convertor for each type of file for component
// config classes? just one I think

import assert from 'assert';
import { parseModule, Program } from 'esprima';
import { ExportDefaultDeclaration, ClassExpression } from 'estree';

export class BaseConvertor {
    tree: Program
    defaultExport: any
    source: string
    constructor(source: string){
        this.source = source
    }
    getTree(source: string) {
        this.tree = parseModule(source, { jsx: true, range: true, comment: true})
        return this
    }
    findDefaultExport() {
        const expDecl = this.tree.body.find(node => node.type === 'ExportDefaultDeclaration')
        assert(expDecl, 'Did not found export default')
        this.defaultExport = expDecl
        return this
    }

}

export class ComponentConvertor extends BaseConvertor {
    componentType: "class" | "functional"
    beforeComponent: string
    component: string
    afterComponent: string
    name: string
    public getComponentType(): this {
        const { type } = this.defaultExport.declaration
        if (type === "ClassDeclaration") this.componentType = 'class'
        if (type === "FunctionDeclaration") this.componentType = 'functional'
        else assert(undefined,
            `Expected export default to be a ClassDeclaration or a FunctionDeclaration,
            but found ${type}`
        );
        return this
    }
    public getComponentPieces() {
        const range = this.defaultExport.declaration.range
        if (range) {
            const [ start, end ] = range
            this.beforeComponent = this.source.substring(0, start)
            this.component = this.source.substring(start, end)
            this.afterComponent = this.source.substring(end)
        }
        return this
    }
    public getComponentName() {
        // this.name = this.
        return this
    }
    public parseComponent(source: string) {
        this.getTree(source)
        .findDefaultExport()
        .getComponentType()
        return this
    }
}



export class StyleConvertor extends BaseConvertor {

}

// read config from locations
// set locations
// write locations
export class Config {
    config: ConfigOptions
    constructor(options?: ConfigOptions) {
        this.config =  options ? options : this.findConfig()
    }
    private findConfig(): ConfigOptions {
        return {}
    }
    public getConfigurationFromFile() {
        return 
    }
}

export interface ConfigOptions {

}
