'use strict';

const pdfGenerator = require('./pdfGenerator');

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'v1.0',
    }),
  };

};

module.exports.generateReceipt = async (event) => {
  pdfGenerator();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'generated receipt',
    }),
  };

};
