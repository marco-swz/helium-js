import terser from '@rollup/plugin-terser';
import css from "rollup-plugin-import-css";
import del from 'rollup-plugin-delete'
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: [
        // 'src/table.ts',
        'src/button.ts',
        //'src/dialog.ts',
        //'src/menu.js',
        //'src/input.ts',
        //'src/check.js',
        //'src/form_dialog.js',
        //'src/select.ts',
        //'src/tabs.ts',
        //'src/toast.ts',
        //'src/helium.js',
        //'src/combo_button.js',
        //'src/toggle.ts',
        //'src/breadcrumb.js',
        //'src/tree.js',
        //'src/sidebar.js',
        //'src/menubar.js',
        //'src/switch.js',
    ],
    output: [
        {
            dir: 'dist/latest',
            format: 'module',
            entryFileNames: '[name]-[hash].js',
        },
        {
            dir: 'dist/latest',
            format: 'module',
            entryFileNames: '[name].js',
        },
        {
            dir: 'dist-min/latest',
            format: 'module',
            entryFileNames: '[name]-[hash].js',
            plugins: [terser()]
        },
    ],
    plugins: [
        css({ alwaysOutput: true }), 
        del({ targets: ['dist/latest', 'dist-min/latest'] }),
        typescript(),
        nodeResolve(),
    ],
};
