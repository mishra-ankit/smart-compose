export function isCursorAtEnd(elem) {
  // Check cursor is at end
  return elem?.selectionEnd === elem?.value.length;
}

export const getPredictedText = (autoComplete, mainInput) => {
  return hasPrediction(autoComplete, mainInput)
    ? autoComplete.value.substr(mainInput.value.length)
    : "";
};

export function pastePrediction(predictionText) {
  document.execCommand("insertText", true, predictionText);
}

export function resetSuggestion(autoComplete) {
  autoComplete.value = "";
}

export const hasPrediction = (autoComplete, mainInput) =>
  autoComplete.value.length > mainInput.value.length;
