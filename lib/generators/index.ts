export * from './post-write'
export * from './newClass'

/** */
export type GeneratorFunction = (newCode: string, originalCode?: string, options?: any) => string

export interface GeneratorFunctionObject{
    order: number;
    name: string;
    function: GeneratorFunction
}