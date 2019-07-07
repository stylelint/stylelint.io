document.addEventListener("DOMContentLoaded", function() {
  const validTriggers = [
    "The following patterns are not considered violations:",
    "The following pattern is not considered a violation:"
  ];
  const invalidTriggers = [
    "The following patterns are considered violations:",
    "The following pattern is considered a violation:"
  ];
  const validClass = "valid-pattern";
  const invalidClass = "invalid-pattern";

  function nextCodeElements(el) {
    const elements = [];

    let next = el.nextElementSibling;
    while (next && next.tagName === "PRE") {
      const code = next.firstElementChild;
      if (code.tagName === "CODE") {
        elements.push(code);
      }
      next = next.nextElementSibling;
    }

    return elements;
  }

  Array.prototype.forEach.call(document.querySelectorAll("p"), function(el) {
    if (validTriggers.indexOf(el.textContent) !== -1) {
      nextCodeElements(el).forEach(function(code) {
        code.classList.add(validClass);
      });
    } else if (invalidTriggers.indexOf(el.textContent) !== -1) {
      nextCodeElements(el).forEach(function(code) {
        code.classList.add(invalidClass);
      });
    }
  });
});
