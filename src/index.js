import "./styles.css";
import { callMLDataSetAPI } from "./suggestion";
import {
  getPredictedText,
  isCursorAtEnd,
  pastePrediction,
  resetSuggestion,
  hasPrediction
} from "./utils";

init(document.getElementById("mainInput"));

init(document.getElementById("secondInput"));

function init(mainInput) {
  const autoComplete = document.createElement("textarea");
  autoComplete.classList.add("autocomplete");
  mainInput.insertAdjacentElement("beforebegin", autoComplete);

  mainInput.addEventListener("keyup", (e) =>
    onKeyUp(e, mainInput, autoComplete)
  );
  // TODO: Can it be another event ? keyup ?
  mainInput.addEventListener("keydown", (e) =>
    onTabClickDown(e, mainInput, autoComplete)
  );
}

function onKeyUp(e, mainInput, autoComplete) {
  if (mainInput.value === "") {
    autoComplete.value = "";
    return;
  }

  switch (e.code) {
    case "Space":
      if (isCursorAtEnd(mainInput)) {
        const response = callMLDataSetAPI(e);
        if (response === "") {
          // predicted = "";
          autoComplete.value = mainInput.value;
        } else {
          //TODO: ? Check if going to next line ? Then cut off prediction to keep it to same line
          // predicted = response;
          autoComplete.value = mainInput.value + response;
        }
      } else {
        // predicted = "";
      }
      break;
    case "Backspace":
      resetSuggestion(autoComplete);
      break;
    case "ArrowRight":
      if (hasPrediction(autoComplete, mainInput) && isCursorAtEnd(mainInput)) {
        pastePrediction(autoComplete.value);
        resetSuggestion(autoComplete);
      }
      break;
    default:
      if (autoComplete.value !== "" && hasPrediction(autoComplete, mainInput)) {
        const predicted = getPredictedText(autoComplete, mainInput);
        var first_character = predicted[0];
        if (e.key !== first_character) {
          resetSuggestion(autoComplete);
        }
      } else {
        resetSuggestion(autoComplete);
      }
  }
}

export function onTabClickDown(e, mainInput, autoComplete) {
  if (e.code === "Tab" && hasPrediction(autoComplete, mainInput)) {
    e.preventDefault();
    pastePrediction(getPredictedText(autoComplete, mainInput));
    resetSuggestion(autoComplete);
  }
}
