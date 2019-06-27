/**
 * Not being used currently, but leaving it here for when the time may come.
 */

import { RollupOptions } from 'rollup'
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import json from 'rollup-plugin-json'
import pkg from "./package.json";
import copy from 'rollup-plugin-copy'

/**
 * @type RollupOptions
 */
const rollup = [
    {
        input: 'bin/react-cli.ts',
        output: [
            {
                file: pkg.main,
                format: "cjs",
                exports: "named",
                sourcemap: true
            },
            {
                file: pkg.module,
                format: "es",
                exports: "named",
                sourcemap: true
            }
        ],
        plugins: [
            json(),
            external(),
            resolve(),
            typescript({
                rollupCommonJSResolveHack: true,
                exclude: [
                    "**/__tests__/**",
                    "**/templates/**"
                ],
                clean: true,
                typescript: require('typescript')
            }),
            commonjs({
                include: ["node_modules/**"],
            }),
            copy({
                targets: [
                    {src: 'templates/**', dest: 'build/templates'}
                ]
            })
        ]
    },
]
export default rollup


