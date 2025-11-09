import terser from '@rollup/plugin-terser';
import css from "rollup-plugin-import-css";
import del from 'rollup-plugin-delete'
import typescript from '@rollup/plugin-typescript';

export default {
    input: [
        'src/table.js',
        'src/button.ts',
        'src/dialog.js',
        'src/menu.js',
        'src/input.js',
        'src/check.js',
        'src/form_dialog.js',
        'src/select.js',
        'src/tabs.js',
        'src/toast.js',
        'src/helium.js',
        'src/combo_button.js',
        'src/toggle.js',
        'src/breadcrumb.js',
        'src/tree.js',
        'src/sidebar.js',
        'src/menubar.js',
        'src/switch.js',
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
        css({ modules: true, alwaysOutput: true }), 
        del({ targets: ['dist/latest', 'dist-min/latest'] }),
        typescript(),
    ],
};
