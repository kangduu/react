let creators = {}
const context = require.context(".", false, /\.creators\.js$/)
context.keys().forEach(key => {
    creators = {
        ...creators,
        ...context(key)
    }
});
export default creators