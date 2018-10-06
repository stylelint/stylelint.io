function isSafari() {
  return (
    window.navigator.userAgent.indexOf("Safari") !== -1 &&
    window.navigator.vendor.indexOf("Apple Computer") !== -1
  );
}

export default isSafari;
