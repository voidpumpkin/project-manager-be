class BusinessRuleError extends Error {
    constructor(message) {
        super(message);
    }
}
module.exports = { BusinessRuleError };
