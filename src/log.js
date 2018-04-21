const chalk = require('chalk');
// TEMP so that when I wanna write a proper
// logger, I don't have to change the main project source much.
module.exports = console.log;
module.exports.error = (err) => {
    console.log(chalk.red.bold(`ERR: ${err}`));
};
