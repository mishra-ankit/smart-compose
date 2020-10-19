import "./styles.css";
import { callMLDataSetAPI } from "./suggestion";
import { isCursorAtEnd, pastePrediction } from "./utils";

let predicted = "";

init(document.getElementById("mainInput"));

function init(mainInput) {
  mainInput.classList.add("vc_textarea");

  const autoComplete = document.createElement("textarea");
  autoComplete.classList.add("vc_textarea");
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
          predicted = "";
          autoComplete.value = mainInput.value;
        } else {
          //TODO: ? Check if going to next line ? Then cut off prediction to keep it to same line
          predicted = response;
          autoComplete.value = mainInput.value + response;
        }
      } else {
        predicted = "";
      }
      break;
    case "Backspace":
      resetSuggestion(autoComplete);
      break;
    case "ArrowRight":
      if (predicted && isCursorAtEnd(mainInput)) {
        pastePrediction(predicted);
        resetSuggestion(autoComplete);
      }
      break;
    default:
      if (autoComplete.value !== "" && predicted) {
        var first_character = predicted.charAt(0);
        if (e.key === first_character) {
          var s1 = predicted;
          var s2 = s1.substr(1);
          predicted = s2;
        } else {
          resetSuggestion(autoComplete);
        }
      } else {
        resetSuggestion(autoComplete);
      }
  }
}

export function resetSuggestion(autoComplete) {
  autoComplete.value = "";
  predicted = "";
}

export function onTabClickDown(e, mainInput, autoComplete) {
  if (e.code === "Tab" && predicted) {
    e.preventDefault();
    pastePrediction(predicted);
    resetSuggestion(autoComplete);
  }
}
