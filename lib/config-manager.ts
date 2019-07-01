import {join} from 'path';
import Debug from 'debug';
import { write, readFileSync, existsSync, readdirSync, writeFile, writeFileSync, statSync } from 'fs'
import defaultConfig from '../templates/react-cli.config.json'

const debug = Debug('config-manager')
const indexName = 'index.js'

const samplesDirPath = join(__dirname, '..', 'templates')
const samplesPathes = {
  func: 'FunctionalComponent.js',
  class: 'ClassComponent.js',
  style: 'Styles.module.scss',
  index: 'index.js',
  config: 'react-cli.config.json',
}

function readConfigDir(dirpath: string) {
  const exists = existsSync(dirpath)
  if (!exists) {
    console.log(`Configured config directory '${dirpath}' doesn't exist, using defaults.`)
    dirpath = samplesDirPath
  }
  debug('readConfigDir', dirpath)
  const samples = {
    functionalComponentSample: readFileSync(join(dirpath, samplesPathes.func)).toString(),
    classComponentSample: readFileSync(join(dirpath, samplesPathes.class)).toString(),
    styleModuleSample: readFileSync(join(dirpath, samplesPathes.style)).toString(),
    indexSample: readFileSync(join(dirpath, samplesPathes.index)).toString(),
    configSample: readFileSync(join(dirpath, samplesPathes.config)).toString(),
  }
  return samples
}

function writeSamples(dirpath: string) {
  const samplesDirPath = join(__dirname, '..', 'templates')
  const samples = readConfigDir(samplesDirPath)
  writeFileSync(join(dirpath, samplesPathes.func), samples.functionalComponentSample)
  writeFileSync(join(dirpath, samplesPathes.class), samples.classComponentSample)
  writeFileSync(join(dirpath, samplesPathes.style), samples.styleModuleSample)
  writeFileSync(join(dirpath, samplesPathes.index), samples.indexSample)
  writeFileSync(join(dirpath, samplesPathes.config), samples.configSample)
}

export function writeConfig(config: any, path: string) {
  const confDir: string = config.configDirectory
  const existsConfDir = existsSync(confDir)
  if (!existsConfDir) {
    console.error(`'${confDir}' does not exist`)
    return
  }
  const stat = statSync(config.configDirectory)
  if (!stat.isDirectory) {
    console.error(`${confDir}' is not a directory`)
    return
  }
  const files = readdirSync(confDir)
  if (files.length === 0) {
    writeSamples(confDir)
  }
  const str = JSON.stringify(config, null, 2)
  write(path, str, 'abc')
}

function readConfig(configPath: string) {
  const exists = existsSync(configPath)
  if (!exists) return defaultConfig
  const str = readFileSync(configPath).toString()
  const config = JSON.parse(str)
  return config
}

export function readOptions(configPath: string) {
  debug('readOptions', configPath)
  const config = readConfig(configPath)
  const confDir = config.configDirectory
  const { configSample, ...samples } = readConfigDir(confDir)
  const options = JSON.parse(configSample)
  return { ...samples, ...options }
}
