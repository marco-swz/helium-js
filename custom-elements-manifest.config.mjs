export default {
    /** Globs to analyze */
    globs: ["src/**/*.ts"],
    /** Globs to exclude */
    exclude: ["src/**/*_styles.ts"],
    /** Directory to output CEM to */
    outdir: "docs",
    /** Run in dev mode, provides extra logging */
    dev: true,
    /** Run in watch mode, runs on file changes */
    watch: false,
    /** Include third party custom elements manifests */
    dependencies: true,
    packagejson: false,
    litelement: true,
    catalyst: false,
    fast: false,
    stencil: false,

    /**
     * Resolution options when using `dependencies: true`
     * For detailed information about each option, please refer to the [oxc-resolver documentation](https://github.com/oxc-project/oxc-resolver?tab=readme-ov-file#options).
     */
    resolutionOptions: {
        extensions: [".js", ".ts"],
        mainFields: ["module", "main"],
        conditionNames: ["import", "require"],
    },
    plugins: [
    ]
}
