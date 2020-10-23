Must -

x- Ctrl+Z not working
x- Don't suggest when mid sentence, only at the end of content
x- When you do a successive 'tab' is doesn't recompute new suggestion
x- Get rid of jQuery
x- Make it more lib like, create the other field on fly
x- Bug - suggestion shown, click left arrow, now click right arrow suggestion is selected, even though it's not shown and user didn't click right arrow at beginning of text
x- get rid of "predicted" global var
x- keep typing and it merges them if it matches the prediction
x- Resize ? It makes them out of sync, Either disable resize, add add auto resize, Or resize the hidden one accordingly
x- tab shouldn't set focus on the "hidden" fields

- Cleanup code

  - Should work with multiple fields
    - Works with a visual bug, need another layout solution

- When scroll point hits, they get shifted and weird.
  - Just suggest 1 word at a time ? With overflow-wrap: normal; ?
  - remove scroll, make it auto increase height, and make sure they both increase when showing
  - Don't suggest if it get's them out of sync
  - Clip suggestion it it's getting them out of sync ?

Nice to have -

- should suggest mid word too ?
- Perf -
  - non blocking ?
  - Do search in background ?
  - Cache words/phrases DB, IndexDB etc
  - debounce ?

Ref -

- https://jsfiddle.net/ourcodeworld/o4k7rfu0/1/
- https://github.com/component/textarea-caret-position
- https://github.com/dwyl/english-words
- https://www.kaggle.com/rtatman/english-word-frequency
- https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words
- https://github.com/first20hours/google-10000-english

- http://dooly-ai.github.io/draft-js-typeahead/
- https://ejmudi.github.io/react-autocomplete-hint/
- https://www.draft-js-plugins.com/plugin/mention
- https://github.com/nikgraf/awesome-draft-js

- https://github.com/facebook/draft-js/issues/616#issuecomment-426047799
- https://codepen.io/jh3y/pen/rpoxxL
- http://jsfiddle.net/dandv/aFPA7/

Markov chain -

- https://shiffman.net/a2z/markov/
- https://github.com/Edwin-Pratt/js-markov/blob/master/src/markov.js

https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt

const str = `<paste the above raw here>`
const longerWords = str.split(/\r?\n/).filter(word => word.length > 3);

Test cases v2 -

- undo, redo should work
- tab or right arrow should insert suggestion
  - Only when done at end of input aka not somewehre within the text
  - when no suggestion arrow keys/tab should work normally
  - when suggestion present, arrow/tab key should prevent default, should not move focus, or move cursor
- Reset suggestion when moves somwehre else in text ?
-
