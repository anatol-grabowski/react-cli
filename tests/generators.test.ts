/**
 * How do we set up tests?
 * + Circle CI
 *  + Create dummy files && do conversions && query results
 *  + Create templates && query results
 */

import { join } from 'path'
import { stdio, MockReadable } from 'stdio-mock'
import { Jest } from '@jest/environment';
const exec = join(__dirname, '..', 'build', 'bin', 'react-cli');

const { stdin, stdout, stderr } = stdio()

beforeAll(() =>{
    stdin.pipe(stdout)
})

afterAll(() => {
    stdout.end()    
})

function consoleLogInput(done: Function, input: string) {
    stdin.write(input);
    stdout.on('data', data => {
        console.log(data)
        done()
    });
};

it('TEST2', done => {
    consoleLogInput(done, 'testicle')
});
