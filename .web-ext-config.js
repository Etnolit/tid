const { createTrue } = require("typescript");

module.exports = {
    verbose: true,
    build: {
        overwriteDest: true
    },
    run: {
        firefox: "stable",
        startUrl: ["about:addons", "about:debugging"]
    },
    ignoreFiles: []
}