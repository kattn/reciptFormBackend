function positionText(x, y){
    return {
      x: x,
      y: y,
      size: 14,
      font: 'TimesRoman',
      colorRgb: [0, 0, 0]
    };
  }
  
  
  // converts a single line string to array of strings of
  // maxCharLength
  function createMultiLine(str){
    let multiLine = [str];
    
    const maxCharLength = 65;
  
    while(multiLine[multiLine.length-1].length > maxCharLength){
      let lastString = multiLine[multiLine.length-1];
      let endOfLastWord = lastString.slice(0, maxCharLength).lastIndexOf(" ");
      multiLine[multiLine.length-1] = lastString.slice(0, endOfLastWord);
      multiLine.push(lastString.slice(endOfLastWord+1));
    }
  
    return multiLine;
  }
  
  
  function getCurrentDateString(){
    let date = new Date();
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
  }
  
  
  // Scales the width and height based on maxWidth and maxHeight
  function scaleDims(width, height, maxWidth, maxHeight){
    // calculate scaling factors
    const widthScalingFactor = width/maxWidth;
    const heightScalingFactor = height/maxHeight;
  
      let newWidth = width;
      let newHeight = height;
    // scale to size based on scaling factors
    if (widthScalingFactor > heightScalingFactor) {
      newWidth = maxWidth;
      newHeight = height/widthScalingFactor;
    } else {
      newWidth = width/heightScalingFactor;
      newHeight = maxHeight;
    }
  
    return {width: newWidth, height: newHeight};
  }
  
  module.exports = {positionText, createMultiLine, getCurrentDateString, scaleDims};
  