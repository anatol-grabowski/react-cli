function findImport(imports, name) {
  let importSpecifier = null
  const importDeclaration = imports.find(imp => {
    return imp.specifiers.find(spec => {
      if (spec.local.name !== name) return false
      importSpecifier = spec
      return true
    })
  })
  return { importDeclaration, importSpecifier }
}

function findExport(exps, name) {
  let exportSpecifier = null
  const exportDeclaration = exps.find(exp => {
    if (exp.declaration) {
      const expName = exp.declaration.id.name
      return expName === name
    }
    return exp.specifiers.find(spec => {
      const expName = spec.exported.name
      if (expName === name) {
        exportSpecifier = spec
        return true
      }
      return false
    })
  })
  return { exportDeclaration, exportSpecifier }
}

module.exports = {
  findImport,
  findExport,
}