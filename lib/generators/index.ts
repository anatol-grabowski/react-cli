export * from './post-write'

/** */
export type GeneratorFunction = (newCode: string, originalCode?: string, options?: any) => string

export interface GeneratorFunctionObject{
    order: number;
    name: string;
    function: GeneratorFunction
}