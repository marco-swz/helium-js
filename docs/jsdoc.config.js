'use strict';

module.exports = {
    plugins: ["custom_tags.js", "plugins/markdown",],
    source: {
        include: ["src"],
        includePattern: ".+\\.js(doc|x)?$",
        excludePattern: "(^|\\/|\\\\)_",
    },
    opts: {
        destination: "docs/generated",
    },
};

