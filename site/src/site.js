// Runs the "Make a SEEN" toy. Same-origin, no network, no storage: choices live only in this page.
(function () {
  var root = document.querySelector("[data-make]");
  if (!root) return;
  var controls = root.querySelector("[data-controls]");
  var out = root.querySelector("[data-output]");
  var tags = root.querySelector("[data-tags]");
  var copyBtn = root.querySelector("[data-copy]");
  var fallback = root.querySelector("[data-fallback]");
  var seeds = root.querySelectorAll("[data-seed]");
  var langs = ["en", "fr", "es"];
  if (!controls || !out || !seeds.length) return;
  controls.hidden = false;
  if (fallback) fallback.hidden = true;

  function checked(name) {
    var el = root.querySelector('input[name="' + name + '"]:checked');
    return el ? el : null;
  }
  function label(input) {
    var span = input && input.parentNode.querySelector("span");
    return span ? span.textContent : "";
  }
  function update() {
    var f = checked("feeling"), o = checked("form"), l = checked("lang");
    if (!f || !o || !l) return;
    var key = langs[+l.value] + "-" + f.value + "-" + o.value;
    for (var i = 0; i < seeds.length; i++) {
      if (seeds[i].getAttribute("data-seed") === key) {
        out.textContent = seeds[i].textContent;
        out.setAttribute("lang", langs[+l.value]);
        break;
      }
    }
    if (tags) tags.textContent = label(f) + " · " + label(o) + " · " + label(l);
  }
  root.addEventListener("change", update);
  update();

  if (copyBtn && navigator.clipboard && navigator.clipboard.writeText) {
    copyBtn.hidden = false;
    var idle = copyBtn.textContent, timer;
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(out.textContent + " (SEEN by CREOVA)").then(function () {
        copyBtn.textContent = copyBtn.getAttribute("data-done") || idle;
        clearTimeout(timer);
        timer = setTimeout(function () { copyBtn.textContent = idle; }, 2000);
      });
    });
  }
})();
