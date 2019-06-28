import fs from 'fs';
import childProcess from 'child_process';
import commander from 'commander';
  
const program = commander
  // .version(packageJson.version)
program
  .description('Manage react components and related files')
  .option('-r, --regex <regex>', 'a pattern to replace in the readme')
  .option('-d, --dry-run', 'write updated file to stdout')
  .arguments('<readmepath> <cmdToRun>')
  .action((readmepath, cmdToRun, options) => {
    //@ts-ignore
    const stdout = childProcess.execSync(cmdToRun, { shell: true }).toString()
    const readme = fs.readFileSync(readmepath).toString()
    const re = RegExp(options.regex) || /(## Usage\n```\n)([\w\W]*?\n)(```\n)/
    const updatedReadme = readme.replace(re, '$1' + stdout + '$3')
    if (options.dryRun) {
      console.log(updatedReadme)
      return
    }
    fs.writeFileSync(readmepath, updatedReadme)
  })

program.parse(process.argv)