var START_STRING = '<meta name="viewport" content="width=device-width, initial-scale=1.0,"/><head><link rel="stylesheet" href="mainq.css" media="screen" /> <link rel="stylesheet" href="noteq.css" media="screen and (max-device-width: 800px)" />\n</head>';

var input = document.getElementById("input");
var output = document.getElementById("output");

function transform(inputValue) {
  return START_STRING + inputValue.replace(/\u00a0/g, "&nbsp;")
                                  .replace(/\r?\n/g, "<br>\n")
                                  .replace(/  /g, "&nbsp;&nbsp;")
                                  .replace(/&nbsp; /g, "&nbsp;&nbsp;");
}

function listener() {
  output.value = transform(input.value);
}

listener();

input.addEventListener("input", listener);

input.addEventListener("paste", function (e) {
  // https://developer.mozilla.org/en-US/docs/Web/Events/paste#JavaScript_2
  // Prevent the default pasting event and stop bubbling
  e.preventDefault();
  e.stopPropagation();

  // Get the clipboard data
  var clipboardData = e.clipboardData || window.clipboardData;
  var paste;
  if (e.clipboardData.types.includes('text/html')) {
    var element = document.createElement('html');
    element.innerHTML = clipboardData.getData('text/html');
    paste = element.querySelector('body').innerHTML;
  } else {
    paste = clipboardData.getData('text/plain');
  }

  var newInputValue = input.value.split('');
  var start = input.selectionStart;
  var end = input.selectionEnd;

  Array.prototype.splice.apply(newInputValue, [start, end - start].concat(paste.split('')));
  input.value = newInputValue.join('');
  input.selectionStart = input.selectionEnd = start + paste.length;

  listener();
});

new ClipboardJS('#copy');
