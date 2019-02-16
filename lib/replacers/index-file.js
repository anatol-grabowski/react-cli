
function updateIndex(opts) {
  const {
    name,
    doCreateIndex,
    indexSource,
    indexSample,
  } = opts
  if (!doCreateIndex) return
  let indexOutSource = indexSource || indexSample
  const tree = esprima.parseModule(indexOutSource, { jsx: true, range: true, comment: true })
  const exps = tree.body.filter(node => node.type === 'ExportNamedDeclaration')
  const { exportDeclaration } = findExport(exps, name)
  if (exportDeclaration) {
    console.log(`Index already exports '${name}'.`)
    return
  }

}

module.exports.updateIndex = updateIndex