var frame = document.getElementById("demo");

if (frame) {
  window.addEventListener(
    "message",
    function(e) {
      window.location.hash = e.data;
    },
    false
  );
  frame.src = frame.src + window.location.hash;
}
