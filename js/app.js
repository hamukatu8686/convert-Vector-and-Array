function convertVectorToArray(text) {
  let inSingleComment = false;
  let inMultiComment = false;
  let inString = false;
  let inChar = false;
  let outputArray = [];
  let ConvertStartPoint = 0;
  for (let x = 0; x < text.length; x++) {
    if(inSingleComment) {
      if(text.substring(x,x+1) === "\n") {
        inSingleComment = false;
      }
      continue;
    }else if(inMultiComment) {
      if(text.substring(x,x+2) === "*/"){
        inMultiComment = false;
      }
      continue;
    }else if(inString) {
      if(text.substring(x,x+1) === "\"") {
        inString = false;
      }
      continue;
    }else if(inChar){
      if(text.substring(x,x+1) === "\'") {
        inChar = false;
      }
      continue;
    }
    if(text.substring(x,x+2) === "//"){
      inSingleComment = true;
      continue;
    }
    if(text.substring(x,x+2) === "/*"){
      inMultiComment = true;
      continue;
    }
    if(text.substring(x,x+1) === "\""){
      inString = true;
      continue;
    }
    if(text.substring(x,x+1) === "\'"){
      inChar = true;
      continue;
    }



    if(text.substring(x,x+4) === ".at("){
      let endCounter = 1;
      let endPos = -1;
      for(let i=x+4;i<text.length;i++){
        if(inSingleComment) {
          if(text.substring(i,i+1) === "\n") {
            inSingleComment = false;
          }
          continue;
        }else if(inMultiComment) {
          if(text.substring(i,i+2) === "*/"){
            inMultiComment = false;
          }
          continue;
        }else if(inString) {
          if(text.substring(i,i+1) === "\"") {
            inString = false;
          }
          continue;
        }else if(inChar){
          if(text.substring(i,i+1) === "\'") {
            inChar = false;
          }
          continue;
        }
        if(text.substring(i,i+2) === "//"){
          inSingleComment = true;
          continue;
        }
        if(text.substring(i,i+2) === "/*"){
          inMultiComment = true;
          continue;
        }
        if(text.substring(i,i+1) === "\""){
          inString = true;
          continue;
        }
        if(text.substring(i,i+1) === "\'"){
          inChar = true;
          continue;
        }

        if(text.charAt(i) === "("){
          endCounter++;
        }else if(text.charAt(i) === ")"){
          endCounter--;
        }
        if(endCounter===0){
          endPos=i;
          break;
        }
      }
      if(endPos===-1){
        throw new Error("Could not find corresponding end tag.");
      }
      outputArray.push(text.substring(ConvertStartPoint, x)); //ConvertStartPointから .at( の直前までをoutputに
      outputArray.push("[");
      //x+4からendPosまでのとこを変換して入れるorそのまま \\text[endPos] = ")"
      let recursionFlag = false;
      for(let i=x+4;i<endPos;i++){
        if(inSingleComment) {
          if(text.substring(i,i+1) === "\n") {
            inSingleComment = false;
          }
          continue;
        }else if(inMultiComment) {
          if(text.substring(i,i+2) === "*/"){
            inMultiComment = false;
          }
          continue;
        }else if(inString) {
          if(text.substring(i,i+1) === "\"") {
            inString = false;
          }
          continue;
        }else if(inChar){
          if(text.substring(i,i+1) === "\'") {
            inChar = false;
          }
          continue;
        }
        if(text.substring(i,i+2) === "//"){
          inSingleComment = true;
          continue;
        }
        if(text.substring(i,i+2) === "/*"){
          inMultiComment = true;
          continue;
        }
        if(text.substring(i,i+1) === "\""){
          inString = true;
          continue;
        }
        if(text.substring(i,i+1) === "\'"){
          inChar = true;
          continue;
        }
        if(text.substring(i,i+4) === ".at("){
          recursionFlag = true;
          break;
        }
      }
      if(recursionFlag){
        outputArray.push(convertVectorToArray(text.substring(x+4,endPos)));
      }else{
        outputArray.push(text.substring(x+4,endPos));
      }
      outputArray.push("]");//xからendPosを含むとこまで入れ終わった
      ConvertStartPoint=endPos+1;
      x = endPos;
    }
  }
  outputArray.push(text.substring(ConvertStartPoint,text.length));
  return outputArray.join("");
}



const toArrayButton = document.getElementById("toArray");
toArrayButton.onclick = () => {
  const text = document.getElementById("vector").value;
  document.getElementById("array").value = convertVectorToArray(text);
}
const toVectorButton = document.getElementById("toVector");
toVectorButton.onclick = () => {
  const text = document.getElementById("array").value;
  let outputArray = [];
  for (let i = 0; i < text.length; i++) {
    if(text.charAt(i) === "[") {
      outputArray.push(".");
      outputArray.push("a");
      outputArray.push("t");
      outputArray.push("(");
    }else if(text.charAt(i) === "]") {
      outputArray.push(")");
    }else{
      outputArray.push(text.charAt(i));
    }
  }
  const output = outputArray.join("");
  document.getElementById("vector").value = output;
}
