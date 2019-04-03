const {
  PDFDocumentFactory,
  PDFDocumentWriter,
  StandardFonts,
  drawText,
  drawLinesOfText,
  drawRectangle,
  drawEllipse,
  drawImage,
} = require('pdf-lib');
const fs = require('fs');


const {
  positionText,
  createMultiLine,
  getCurrentDateString,
  scaleDims,
} = require('./tools');


// Generates a Reciptform based on the input
// TODO: Requires validation of fields
function pdfGenerator(reciptFormInput) {
  // create text for checkboxes
  let expenses = "";
  let card = "";
  if (reciptFormInput.type === "card") {
    card = "X";
  }
  else if (reciptFormInput.type === "deposit") {
    expenses = "X";
  }
  else {
    throw "Got unexpected recipt type";
  }

  fs.readFile('./assets/template.pdf', (err, fd) => {
    if (err) {
      if (err.code == 'ENOENT') {
        console.error('./assets/template.pdf file not found');
        return;
      }
      throw err;
    }

    // load the template reciptform
    const reciptform = PDFDocumentFactory.create();

    const templateReciptForm = PDFDocumentFactory.load(fd);
    const [timesRomanRef, timesRomanFont] = templateReciptForm.embedStandardFont(
      StandardFonts.TimesRoman,
    );

    const page = templateReciptForm.getPages()[0];

    page.addFontDictionary('TimesRoman', timesRomanRef);

    // place the textual input on the template reciptform
    const formContentStream = templateReciptForm.createContentStream(
      drawText(reciptFormInput.fullname, positionText(165, 627)),
      drawText(reciptFormInput.email, positionText(165, 599)),
      drawText(reciptFormInput.committee.name, positionText(165, 571)),
      drawText(getCurrentDateString(), positionText(441, 571)),
      drawText(reciptFormInput.account, positionText(165, 527)),
      drawText(reciptFormInput.amount, positionText(441, 527)),
      drawText(reciptFormInput.intent, positionText(165, 483)),
      drawText(expenses, positionText(392, 483)),
      drawText(card, positionText(392, 466)),
      drawLinesOfText(createMultiLine(reciptFormInput.comments), positionText(165, 440)),
    );

    // place the reciptFormInput.signature

    // width/height of signature field
    const [pngImage, pngDims] = templateReciptForm.embedPNG(reciptFormInput.signature);

    const maxWidth = 397;
    const maxHeight = 97;
    const scaledSignDims = scaleDims(pngDims.width, pngDims.height, maxWidth, maxHeight);

    page.addImageObject("reciptFormInput.signature", pngImage);
    const signContentStream = templateReciptForm.createContentStream(
      drawImage("reciptFormInput.signature", {
        x: 161,
        y: 101,
        width: scaledSignDims.width,
        height: scaledSignDims.height,
      }),
    );

    page.addContentStreams(
      templateReciptForm.register(formContentStream),
      templateReciptForm.register(signContentStream)
    );

    reciptform.addPage(page);

    // append the attachments
    for (let attachment in reciptFormInput.attachments) {
      switch (attachment.type) {
        case "image/jpg":
        case "image/png":
          const pageSize = [350, 500];
          const page = reciptform.createPage(pageSize);
          const [pngImage, pngDims] = templateReciptForm.embedPNG(attachment.file);
          const scaled = scaleDims(pngDims.width, pngDims.height);

          page.addImageObject("attachment", pngImage);
          const attachmentContentStream = templateReciptForm.createContentStream(
            drawImage("attachment", {
              x: 0,
              y: 0,
              width: scaled.width,
              height: scaled.height,
            }),
          );

          page.addContentStreams(
            templateReciptForm.register(attachmentContentStream)
          );

          reciptform.addPage(page);
          break;
        case "application/pdf":
          const pdf = PDFDocumentFactory.load(attachment.file);
          for (let pdfPage in pdf.getPages()) {
            reciptform.addPage(pdfPage);
          }
          break;
        default:
          throw "Unsupported file";
      }
    }

    const pdfBytes = PDFDocumentWriter.saveToBytes(reciptform);

    return pdfBytes;

    // save the pdf to file
    // const filePath = './assets/generated.pdf';
    // fs.writeFileSync(filePath, pdfBytes);
  });
}

module.exports = pdfGenerator;
