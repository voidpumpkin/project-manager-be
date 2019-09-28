exports.get = (value, path, defaultValue) => {
    return String(path)
        .split('.')
        .reduce((acc, v) => {
            try {
                acc = acc[v] || defaultValue;
            } catch (e) {
                return defaultValue;
            }
            return acc;
        }, value);
};
exports.logCtxErr = err => {
    const log =
        process.env.LOG_REQ === 'true'
            ? () => {
                  console.error('      err: ' + err.message);
              }
            : () => {};
    log();
};
