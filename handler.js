'use strict';

const pdfGenerator = require('./src/pdfGenerator');


exports.generateReceipt = async (event) => {
  const pdf = pdfGenerator(event);
  console.log(pdf)
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'generated receipt',
      type: 'application/pdf',
      content: pdf
    }),
  };

};
