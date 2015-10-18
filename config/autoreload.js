module.exports.autoreload = {
    active: true,
    usePolling: false,
    dirs: [
        "api/models",
        "api/controllers",
        "api/services",
        "config/locales",
        'assets/*'
    ],
    ignored: [
        // Ignore all files with .ts extension
        "**.ts"
    ]
};