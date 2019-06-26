import typescript from 'rollup-plugin-typescript2';
 
export default {
    input: './main.ts',
 
    plugins: [
        typescript(/*{ plugin options }*/)
    ]
}