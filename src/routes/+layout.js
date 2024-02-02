export const prerender = true;
export const ssr = false;
if ("virtualKeyboard" in navigator) {
  console.log(navigator.virtualKeyboard.overlaysContent); // false
  navigator.virtualKeyboard.overlaysContent = true; // Opt out of the automatic handling.
}