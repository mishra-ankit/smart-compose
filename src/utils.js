export function isCursorAtEnd(elem) {
  // Check cursor is at end
  return elem?.selectionEnd === elem?.value.length;
}

export function pastePrediction(predictionText) {
  document.execCommand("insertText", true, predictionText);
}
