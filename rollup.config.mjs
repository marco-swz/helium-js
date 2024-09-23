import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';

export default {
    input: [
        'src/table.js',
        'src/button.js',
        'src/dialog.js',
        'src/menu.js',
        'src/input.js',
        'src/check.js',
        'src/form_dialog.js',
        'src/select.js',
        'src/tabs.js',
        'src/toast.js',
        'src/helium.js',
    ],
    output: [
        {
            dir: 'dist/0.5.0',
            format: 'module',
        },
        {
            dir: 'dist-min/0.5.0',
            format: 'module',
            plugins: [terser()]
        },
    ],
    plugins: [css({ modules: true })],
};
