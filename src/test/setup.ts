import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { setLatency, setSimulation } from "../app/services/runtime";

// jsdom lacks these browser APIs used by the app.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false }) as MediaQueryList;
}
window.scrollTo = () => {};
if (!Element.prototype.scrollBy) Element.prototype.scrollBy = () => {};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  setLatency(0);
  setSimulation("none");
});

afterEach(() => cleanup());
