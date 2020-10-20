import "./styles.css";
import { callMLDataSetAPI } from "./suggestion";
import {
  getPredictedText,
  isCursorAtEnd,
  pastePrediction,
  resetSuggestion,
  hasPrediction,
  resized
} from "./utils";

init(document.getElementById("mainInput"));

init(document.getElementById("secondInput"));

function isMatch(mainInput, autoComplete, key) {
  const first_character = autoComplete.value[mainInput.value.length - 1];
  return key === "Shift" || key === first_character;
}

function init(mainInput) {
  const autoComplete = document.createElement("textarea");
  autoComplete.classList.add("autocomplete");
  autoComplete.setAttribute("disabled", "");
  autoComplete.setAttribute("tabindex", "-1");

  mainInput.insertAdjacentElement("beforebegin", autoComplete);

  mainInput.addEventListener("keyup", (e) =>
    onKeyUp(e, mainInput, autoComplete)
  );
  // TODO: Can it be another event ? keyup ?
  mainInput.addEventListener("keydown", (e) =>
    onTabClickDown(e, mainInput, autoComplete)
  );

  new ResizeObserver(() => resized(mainInput, autoComplete)).observe(mainInput);
}

function onKeyUp(e, mainInput, autoComplete) {
  if (mainInput.value === "") {
    autoComplete.value = "";
    return;
  }

  if (isMatch(mainInput, autoComplete, e.key)) {
    return;
  }

  switch (e.code) {
    case "Space":
      if (!hasPrediction(autoComplete, mainInput) && isCursorAtEnd(mainInput)) {
        const response = callMLDataSetAPI(e);
        if (response === "") {
          autoComplete.value = mainInput.value;
        } else {
          //TODO: ? Check if going to next line ? Then cut off prediction to keep it to same line
          autoComplete.value = mainInput.value + response;
        }
      } else {
        // TODO: Only reset when it's not matching current value
        resetSuggestion(autoComplete);
      }
      break;
    case "ArrowRight":
      if (hasPrediction(autoComplete, mainInput) && isCursorAtEnd(mainInput)) {
        pastePrediction(getPredictedText(autoComplete, mainInput));
        resetSuggestion(autoComplete);
      }
      break;
    default:
      resetSuggestion(autoComplete);
  }
}

export function onTabClickDown(e, mainInput, autoComplete) {
  if (
    e.code === "Tab" &&
    hasPrediction(autoComplete, mainInput) &&
    isCursorAtEnd(mainInput)
  ) {
    e.preventDefault();
    pastePrediction(getPredictedText(autoComplete, mainInput));
    resetSuggestion(autoComplete);
  }
}
