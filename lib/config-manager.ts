import fs from 'fs';
import path from 'path';
import Debug from 'debug';
//@ts-ignore
import { write } from 'filesys'
// @ts-ignore - may cause error, ts don't like fam
import defaultConfig from '../templates/react-cli.config.json'

const debug = Debug('config-manager')
const indexName = 'index.js'

const samplesDirPath = path.join(__dirname, '..', 'templates')
const samplesPathes = {
  func: 'FunctionalComponent.js',
  class: 'ClassComponent.js',
  style: 'Styles.module.scss',
  index: 'index.js',
  config: 'react-cli.config.json',
}

function readConfigDir(dirpath: string) {
  const exists = fs.existsSync(dirpath)
  if (!exists) {
    console.log(`Configured config directory '${dirpath}' doesn't exist, using defaults.`)
    dirpath = samplesDirPath
  }
  debug('readConfigDir', dirpath)
  const samples = {
    functionalComponentSample: fs.readFileSync(path.join(dirpath, samplesPathes.func)).toString(),
    classComponentSample: fs.readFileSync(path.join(dirpath, samplesPathes.class)).toString(),
    styleModuleSample: fs.readFileSync(path.join(dirpath, samplesPathes.style)).toString(),
    indexSample: fs.readFileSync(path.join(dirpath, samplesPathes.index)).toString(),
    configSample: fs.readFileSync(path.join(dirpath, samplesPathes.config)).toString(),
  }
  return samples
}

function writeSamples(dirpath: string) {
  const samplesDirPath = path.join(__dirname, '..', 'templates')
  const samples = readConfigDir(samplesDirPath)
  /**
   * 2 arguments supplied, but 3 were required.
   * original function has 3rd functional optional in TS
   */
  write(path.join(dirpath, samplesPathes.func), samples.functionalComponentSample)
  write(path.join(dirpath, samplesPathes.class), samples.classComponentSample)
  write(path.join(dirpath, samplesPathes.style), samples.styleModuleSample)
  write(path.join(dirpath, samplesPathes.index), samples.indexSample)
  write(path.join(dirpath, samplesPathes.config), samples.configSample)
}

/**
 * TODO: WHAT IS `CONFIG`?
 * @param config The config file, `JSON`?
 * @param path path to the config file
 */
export function writeConfig(config: any, path: string) {
  const confDir: string = config.configDirectory
  const existsConfDir = fs.existsSync(confDir)
  if (!existsConfDir) {
    console.error(`'${confDir}' does not exist`)
    return
  }
  const stat = fs.statSync(config.configDirectory)
  if (!stat.isDirectory) {
    console.error(`${confDir}' is not a directory`)
    return
  }
  const files = fs.readdirSync(confDir)
  if (files.length === 0) {
    writeSamples(confDir)
  }
  const str = JSON.stringify(config, null, 2)
  write(path, str, 'abc')
}

function readConfig(configPath: string) {
  const exists = fs.existsSync(configPath)
  if (!exists) return defaultConfig
  const str = fs.readFileSync(configPath).toString()
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
