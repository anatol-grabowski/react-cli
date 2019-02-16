const assert = require('assert')
const esprima = require('esprima')

function parseComponent(source) {
  const tree = esprima.parseModule(source, { jsx: true, range: true, comment: true })
  const expDecl = tree.body.find(node => node.type === 'ExportDefaultDeclaration')
  assert(expDecl, 'Did not found export default')
  const isClassComponent = expDecl.declaration.type === 'ClassDeclaration'
  const isFunctionalComponent = expDecl.declaration.type === 'FunctionDeclaration'
  assert(isClassComponent || isFunctionalComponent, `Expected export default to be a ClassDeclaration or a FunctionDeclaration but found ${expDecl.declaration.type}`)
  const cmpDecl = expDecl.declaration
  const beforeComponent = source.substring(0, cmpDecl.range[0])
  const component = source.substring(...cmpDecl.range)
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

function convertToClassComponent(source) {
  const tree = esprima.parseModule(source, { jsx: true, range: true, comment: true }).body[0]
  const name = tree.id.name
  const propsParam = tree.params.length ? tree.params[0].name : null
  const render = tree.body
  let body = source.substring(...render.range)
  const rePropsParam = RegExp(`(\\W)${propsParam}(\\W)`, 'g')
  body = body.replace(rePropsParam, '$1this.props$2')
  body = 'render() ' + body
  body = body.replace(/^/gm, '  ')
  const clas = `class ${name} extends React.Component {\n${body}\n}`
  return clas
}

function convertToFunctionalComponent(source) {
  const tree = esprima.parseModule(source, { jsx: true, range: true, comment: true }).body[0]
  const name = tree.id.name
  const render = tree.body.body.find(node => node.type === 'MethodDefinition' && node.key.name === 'render')
  let body = source.substring(...render.value.body.range)
  body = body.replace(/^  /gm, '')
  body = body.replace(/(\W)this./g, '$1')
  const func = `function ${name}(props) ${body}`
  return func
}

function updateComponent(opts) {
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

module.exports.updateComponent = updateComponent