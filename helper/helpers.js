const sendResponse = (meta, result, statusCodes, res) => {
  let response = {};
  response.meta = meta;
  response.data = result;
  res.status(statusCodes).send(response);
};

const sendMessage = (meta, message, statusCodes, res) => {
  let response = {};
  response.data = meta.data === undefined ? [] : meta.data;
  meta.data = undefined;
  response.meta = meta;
  response.message = message;
  res.status(statusCodes).send(response);
};

const sendMetaMessage = (meta, message, statusCodes, res) => {
  let response = {};
  response.data = meta.data;
  meta.data = undefined;
  response.meta = meta;
  response.message = message;
  response.meta.length = res.length;
  response.meta.pageCount = res.pageCount;
  response.meta.size = res.size;
  response.meta.page = res.page;
  res.res.status(statusCodes).send(response);
};

module.exports = { sendResponse, sendMessage, sendMetaMessage };
