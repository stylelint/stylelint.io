// Create IE + others compatible event handler
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

// Listen to message from child window
eventer(
  messageEvent,
  function(e) {
    window.location.hash = e.data;
  },
  false
);

var frame = document.getElementById("demo");

if (frame) {
  frame.src = frame.src + window.location.hash;
}
