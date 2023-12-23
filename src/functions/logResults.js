const fs = require("fs");
/**
 * @private
 * @param {String} data
 */
const logResults = (data) => {
  fs.writeFileSync("./log.json", data);
};

module.exports = logResults;
