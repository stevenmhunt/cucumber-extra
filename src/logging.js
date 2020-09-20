
function error(msg) {
    console.warn(`ERROR [cucumber-extra] ${msg}`);
}

function warn(msg) {
    console.warn(`WARN [cucumber-extra] ${msg}`);
}

function info(msg) {
    console.warn(`INFO [cucumber-extra] ${msg}`);
}

module.exports = {
    error,
    warn,
    info
}