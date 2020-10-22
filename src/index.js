import "./styles.css";
import { callMLDataSetAPI } from "./suggestion";
import {
  getPredictedText,
  isCursorAtEnd,
  pastePrediction,
  resetSuggestion,
  resized
} from "./utils";
import debounce from "debounce";
import { words } from "./words";

init(document.getElementById("mainInput"));

// init(document.getElementById("secondInput"));

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

async function onKeyUp(e, mainInput, autoComplete) {
  if (mainInput.value === "") {
    autoComplete.value = "";
    return;
  }

  if (isMatch(mainInput, autoComplete, e.key)) {
    return;
  }

  switch (e.code) {
    case "Space":
      resetSuggestion(autoComplete);
      if (isCursorAtEnd(mainInput)) {
        const response = await callMLDataSetAPI(e);
        //TODO: ? Check if going to next line ? Then cut off prediction to keep it to same line
        autoComplete.value = mainInput.value + response;
      }
      break;
    case "ArrowRight":
      if (isCursorAtEnd(mainInput)) {
        pastePrediction(getPredictedText(autoComplete, mainInput));
        resetSuggestion(autoComplete);
      }
      break;
    default:
      resetSuggestion(autoComplete);
  }
}

export function onTabClickDown(e, mainInput, autoComplete) {
  if (e.code === "Tab" && isCursorAtEnd(mainInput)) {
    e.preventDefault();
    pastePrediction(getPredictedText(autoComplete, mainInput));
    resetSuggestion(autoComplete);
  }
}

//SECOND METHOD -

const prediction = document.getElementById("prediction");
const secondInput = document.getElementById("secondInput");
secondInput.value = "This conse";
// secondInput.focus();
const MIN_WORD_LENGTH_TO_TRIGGER_SUGGEST = 2;

function getLastWord(secondInput) {
  const text = secondInput.value;
  const lastSpaceAt = text.lastIndexOf(" ");
  if (lastSpaceAt < 0) {
    return;
  }
  return text.substr(lastSpaceAt + 1).trim();
}

function resetSelect() {
  prediction.innerText = "";
}

function onInput(e) {
  resetSelect();
  const lastWord = getLastWord(secondInput);
  // TODO: Optimize to filter existing list if new word is just addition to last word.
  if (
    lastWord &&
    lastWord !== "" &&
    lastWord.length > MIN_WORD_LENGTH_TO_TRIGGER_SUGGEST
  ) {
    const result = words.filter(
      // Don't show word itself in prediction
      (word) => word.length > lastWord.length && word.indexOf(lastWord) === 0
    );
    if (result.length) {
      setPredictions(result, prediction);
    }
  }
}

function setPredictions(result, prediction) {
  prediction.innerHTML = result
    .map((word) => `<option value="${word}">${word}</option>`)
    .join("");
  prediction.selectedIndex = 0;
}

function hasPrediction(select) {
  return prediction.options?.length;
}

// function onTabDown(e, select, mainInput) {
//   if (e.code === "Tab" && isCursorAtEnd(mainInput)) {
//     e.preventDefault();
//     pastePrediction(getPredictedText(autoComplete, mainInput));
//     resetSuggestion(autoComplete);
//   }
// }

const debouncedOnInput = debounce(onInput, 400);
secondInput.addEventListener("input", debouncedOnInput);
secondInput.addEventListener("keydown", (e) => {
  // arrow right - paste selected one
  // arrow left ?
  // arror up, down - change selection
  // esc - erase prediction
  if (!hasPrediction(prediction)) {
    return;
  }

  const predictionsCount = prediction.options?.length ?? 0;

  switch (e.code) {
    case "Escape":
    case "ArrowLeft":
      resetSelect();
      break;
    case "ArrowRight":
    case "Tab":
      const lastWord = getLastWord(secondInput);
      pastePrediction(prediction.value.substr(lastWord.length) + " ");
      e.preventDefault();
      break;
    case "ArrowUp":
      prediction.selectedIndex = Math.max(prediction.selectedIndex - 1, 0);
      e.preventDefault();
      break;
    case "ArrowDown":
      prediction.selectedIndex = Math.min(
        prediction.selectedIndex + 1,
        predictionsCount - 1
      );
      e.preventDefault();
      break;
    default:
  }
});
