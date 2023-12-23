const axios = require("axios");

/**
 * @private
 * @typedef {Object} AxiosProps
 * @prop {String} url Request url
 * @prop {Number} [limit=100]
 */

/**
 * @private
 * @param {AxiosProps} axiosprops
 * @returns {Promise<Object[]>}
 */
const offsetRequest = async (axiosprops) => {
  let limit =
    typeof axiosprops.limit === "number" && axiosprops.limit <= 100
      ? axiosprops.limit
      : 100;
  let resp = [];
  let req;
  const requestURL = axiosprops.url;
  delete axiosprops.url;

  for (let i = 0; true; i++) {
    req = await axios({
      method: "GET",
      url: requestURL,
      params: {
        limit,
        offset: i * limit,
        ...axiosprops,
      },
    });
    if (req.data.response === "error") {
      console.error("ERR:");
      throw Error(req.data.errors);
    }
    if (req.data.response === "entity") {
      resp = req.data.data;
      break;
    } else if (req.data.response === "collection") {
      if (req.data.data.length === 0) break;
      resp = resp.concat(req.data.data);
    }
  }
  return resp;
};

module.exports = offsetRequest;
