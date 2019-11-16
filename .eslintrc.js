module.exports = {
    extends: ['voidpumpkin'],
    parserOptions: {
        ecmaVersion: 9
    },
    env: {
        node: true,
        mocha: true
    },
    rules: {
        'require-atomic-updates': 'off'
    },
    overrides: [
        {
            files: ['*.test.*'],
            env: {
                mocha: true
            }
        }
    ]
};
