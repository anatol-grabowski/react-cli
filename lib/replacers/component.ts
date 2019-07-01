import assert from 'assert';
import {parseModule} from 'esprima';
import { ExportDefaultDeclaration } from 'estree';
 
// import React from 'react'

/**
 * Not sure what do to here
 * @param source what kind of string is this?
 */
function parseComponent(source: string) {
  /**
   * What does this do?
   */
  const tree = parseModule(source, { jsx: true, range: true, comment: true })
  /**
   * TODO: remove any and fix type errors
   * This removes warning of many type errors.
   * - const expDecl = ...
   * + const expDecl: any = ...
   */
  const expDecl:any = tree.body.find(node => node.type === 'ExportDefaultDeclaration')
  console.log(expDecl)
  assert(expDecl, 'Did not found export default')
  const isClassComponent = expDecl.declaration.type === 'ClassDeclaration'
  const isFunctionalComponent = expDecl.declaration.type === 'FunctionDeclaration'
  assert(isClassComponent || isFunctionalComponent, `Expected export default to be a ClassDeclaration or a FunctionDeclaration but found ${expDecl.declaration.type}`)
  const cmpDecl = expDecl.declaration
  console.log(cmpDecl)
  const beforeComponent = source.substring(0, cmpDecl.range[0])
  const component = source.substring(cmpDecl.range[0], cmpDecl.range[1])
  const afterComponent = source.substring(cmpDecl.range[1])
  return {
    isClassComponent,
    isFunctionalComponent,
    beforeComponent,
    component,
    afterComponent,
    name: cmpDecl.id.name,
  }
}

/**
 * TODO: `remove any`
 */
function convertToClassComponent(source: string) {
  const tree:any = parseModule(source, { jsx: true, range: true, comment: true }).body[0]
  const name = tree.id.name
  const propsParam = tree.params.length ? tree.params[0].name : null
  const render:any = tree.body
  // @ts-ignore
  let body = source.substring(...render.range)
  const rePropsParam = RegExp(`(\\W)${propsParam}(\\W)`, 'g')
  body = body.replace(rePropsParam, '$1this.props$2')
  body = 'render() ' + body
  body = body.replace(/^/gm, '  ')
  const clas = `class ${name} extends React.Component {\n${body}\n}`
  return clas
}

function convertToFunctionalComponent(source:any) {
  const tree:any = parseModule(source, { jsx: true, range: true, comment: true }).body[0]
  const name = tree.id.name
  const render = tree.body.body.find((node:any) => node.type === 'MethodDefinition' && node.key.name === 'render')
  let body = source.substring(...render.value.body.range)
  body = body.replace(/^  /gm, '')
  body = body.replace(/(\W)this./g, '$1')
  const func = `function ${name}(props) ${body}`
  return func
}

export function updateComponent(opts: any) {
  const {
    doCreateComponent,
    doCreateFunctionalComponent,
    doCreateClassComponent,
    name,
    componentSource,
    functionalComponentSample,
    classComponentSample,
  } = opts
  if (!doCreateComponent) return
  let componentOutSource = componentSource
  if (!componentOutSource) {
    componentOutSource = doCreateFunctionalComponent
      ? functionalComponentSample || classComponentSample
      : classComponentSample || functionalComponentSample
  }
  const parsed = parseComponent(componentOutSource)
  const {
    isFunctionalComponent,
    isClassComponent,
    beforeComponent,
    afterComponent,
    name: origName,
  } = parsed
  let { component } = parsed
  if (isFunctionalComponent && doCreateClassComponent) {
    component = convertToClassComponent(component)
  }
  if (isClassComponent && doCreateFunctionalComponent) {
    component = convertToFunctionalComponent(component)
  }
  componentOutSource = beforeComponent + component + afterComponent
  const reName = RegExp(origName, 'g')
  componentOutSource = componentOutSource.replace(reName, name)
  opts.componentOutSource = componentOutSource
}