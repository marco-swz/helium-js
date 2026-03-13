import terser from '@rollup/plugin-terser';
import css from "rollup-plugin-import-css";
import del from 'rollup-plugin-delete'
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: [
        // 'src/table.ts',
        'src/button.ts',
        'src/popover.ts',
        'src/dialog.ts',
        'src/input.ts',
        //'src/menu.js',
        //'src/check.js',
        //'src/form_dialog.js',
        //'src/select.ts',
        //'src/tabs.ts',
        //'src/toast.ts',
        //'src/helium.js',
        //'src/combo_button.js',
        //'src/toggle.ts',
        //'src/breadcrumb.js',
        'src/tree.ts',
        //'src/sidebar.js',
        //'src/menubar.js',
        //'src/switch.js',
    ],
    output: [
        {
            dir: 'dist/1.0.0',
            format: 'module',
            entryFileNames: '[name]-[hash].js',
        },
        {
            dir: 'dist/1.0.0',
            format: 'module',
            entryFileNames: '[name].js',
        },
        {
            dir: 'dist-min/1.0.0',
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
