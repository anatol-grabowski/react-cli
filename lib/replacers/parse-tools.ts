export function findImport(imports:any, name:any) {
  let importSpecifier = null
  const importDeclaration = imports.find((imp:any) => {
    return imp.specifiers.find((spec:any) => {
      if (spec.local.name !== name) return false
      importSpecifier = spec
      return true
    })
  })
  return { importDeclaration, importSpecifier }
}

export function findExport(exps:any, name:any) {
  let exportSpecifier = null
  const exportDeclaration = exps.find((exp:any) => {
    if (exp.declaration) {
      const expName = exp.declaration.id.name
      return expName === name
    }
    return exp.specifiers.find((spec:any) => {
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