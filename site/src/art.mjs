// Hand-built SVG art for the website: the mascot ("Seen", a one-eyed creature that stands for being seen)
// and three inked spot illustrations. Everything is decorative (aria-hidden), inline, and request-free.
// Colours are the SEEN app's accents: story amber, creator purple, funding gold, info blue, success green.

const INK = "#0b0b0c";
const PURPLE = "#c084fc";
const AMBER = "#fbbf24";
const GOLD = "#ffd166";
const BLUE = "#60a5fa";
const GREEN = "#20c997";
const PINK = "#ff8fb1";

const SVG = (cls, vb, inner) =>
  `<svg class="${cls}" viewBox="${vb}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

/** A four-point anime sparkle centred on (0,0), scaled by s. */
export const sparkle = (x, y, s = 1, fill = "#fff", rot = 0) =>
  `<path transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="${fill}" d="M0 -12 C1.6 -4.5 4.5 -1.6 12 0 C4.5 1.6 1.6 4.5 0 12 C-1.6 4.5 -4.5 1.6 -12 0 C-4.5 -1.6 -1.6 -4.5 0 -12Z"/>`;

/** An explosive "pop" burst behind a word or a character. */
export const burst = (cls = "burst", fill = AMBER) => {
  const pts = [];
  const n = 14;
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n;
    const r = i % 2 ? 62 : 96;
    pts.push(`${(100 + Math.cos(a) * r).toFixed(1)},${(100 + Math.sin(a) * r).toFixed(1)}`);
  }
  return SVG(cls, "0 0 200 200", `<polygon points="${pts.join(" ")}" fill="${fill}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`);
};

/**
 * The mascot. pose: "hello" (waving), "wow" (star-struck), "joy" (happy-closed eye), "read" (looking at a book).
 * uid keeps gradient ids unique when several are on one page.
 */
export function mascot(pose = "hello", uid = 0) {
  const g = `iris${uid}`;
  const eye = {
    hello: `<g class="iris"><circle cx="110" cy="108" r="45" fill="url(#${g})" stroke="${INK}" stroke-width="5"/><circle cx="110" cy="108" r="19" fill="#12041f"/><circle cx="95" cy="92" r="11" fill="#fff"/><circle cx="127" cy="124" r="5" fill="#fff"/>${sparkle(128, 90, 0.7)}</g>`,
    wow: `<g class="iris"><circle cx="110" cy="108" r="50" fill="url(#${g})" stroke="${INK}" stroke-width="5"/>${sparkle(110, 108, 2.1, "#fff")}${sparkle(84, 84, 0.8)}${sparkle(138, 132, 0.6)}</g>`,
    joy: `<path d="M58 118 Q110 56 162 118" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M70 112 Q110 72 150 112" fill="none" stroke="${PURPLE}" stroke-width="5" stroke-linecap="round"/>${sparkle(150, 78, 0.8, AMBER)}${sparkle(70, 82, 0.6, PURPLE)}`,
    read: `<g class="iris" transform="translate(-12 14)"><circle cx="110" cy="108" r="43" fill="url(#${g})" stroke="${INK}" stroke-width="5"/><circle cx="110" cy="108" r="18" fill="#12041f"/><circle cx="96" cy="94" r="10" fill="#fff"/><circle cx="126" cy="122" r="4.5" fill="#fff"/></g>`,
  }[pose];
  const mouth = {
    hello: `<path d="M94 170 Q110 186 126 170" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
    wow: `<ellipse cx="110" cy="174" rx="8" ry="10" fill="#5b1a2e" stroke="${INK}" stroke-width="4"/>`,
    joy: `<path d="M88 158 Q110 196 132 158 Z" fill="#5b1a2e" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M98 176 Q110 186 122 176" fill="${PINK}" stroke="none"/>`,
    read: `<path d="M98 172 Q110 178 122 172" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
  }[pose];
  const arms = {
    hello: `<path class="wave" d="M186 120 Q214 96 206 66" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path class="wave" d="M186 120 Q214 96 206 66" fill="none" stroke="${PURPLE}" stroke-width="9" stroke-linecap="round"/><circle class="wave" cx="206" cy="62" r="12" fill="${PURPLE}" stroke="${INK}" stroke-width="5"/><path d="M34 128 Q14 150 24 172" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M34 128 Q14 150 24 172" fill="none" stroke="${PURPLE}" stroke-width="9" stroke-linecap="round"/>`,
    wow: `<path d="M34 120 Q8 100 16 70" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M34 120 Q8 100 16 70" fill="none" stroke="${PURPLE}" stroke-width="9" stroke-linecap="round"/><path d="M186 120 Q212 100 204 70" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M186 120 Q212 100 204 70" fill="none" stroke="${PURPLE}" stroke-width="9" stroke-linecap="round"/>`,
    joy: `<path d="M34 128 Q8 124 14 96" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M34 128 Q8 124 14 96" fill="none" stroke="${PURPLE}" stroke-width="9" stroke-linecap="round"/><path d="M186 128 Q212 124 206 96" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M186 128 Q212 124 206 96" fill="none" stroke="${PURPLE}" stroke-width="9" stroke-linecap="round"/>`,
    read: `<path d="M40 150 Q50 190 86 196" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M40 150 Q50 190 86 196" fill="none" stroke="${PURPLE}" stroke-width="9" stroke-linecap="round"/><path d="M180 150 Q170 190 134 196" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M180 150 Q170 190 134 196" fill="none" stroke="${PURPLE}" stroke-width="9" stroke-linecap="round"/>`,
  }[pose];
  const book =
    pose === "read"
      ? `<g transform="translate(110 198)"><path d="M-44 -6 L0 -14 L44 -6 L44 20 L0 12 L-44 20 Z" fill="${AMBER}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M0 -14 L0 12" stroke="${INK}" stroke-width="4"/><path d="M-34 0 L-8 -4 M-34 8 L-8 4 M8 -4 L34 0 M8 4 L34 8" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".55"/></g>`
      : "";
  return SVG(
    `mascot mascot--${pose}`,
    "0 0 220 244",
    `<defs><radialGradient id="${g}" cx="38%" cy="32%" r="78%"><stop offset="0" stop-color="#f3e8ff"/><stop offset=".42" stop-color="${PURPLE}"/><stop offset="1" stop-color="#5b21b6"/></radialGradient></defs>
    <ellipse cx="110" cy="236" rx="56" ry="7" fill="#000" opacity=".4"/>
    <ellipse cx="86" cy="214" rx="19" ry="11" fill="${PURPLE}" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="134" cy="214" rx="19" ry="11" fill="${PURPLE}" stroke="${INK}" stroke-width="5"/>
    ${pose === "read" ? "" : arms}
    <circle cx="110" cy="112" r="86" fill="#fffdfa" stroke="${INK}" stroke-width="6"/>
    <path d="M30 96 Q40 44 98 30 Q58 54 52 112 Z" fill="#efe7ff" opacity=".8"/>
    ${eye}
    <ellipse cx="50" cy="146" rx="13" ry="7.5" fill="${PINK}" opacity=".75"/>
    <ellipse cx="170" cy="146" rx="13" ry="7.5" fill="${PINK}" opacity=".75"/>
    <path d="M158 40 q6 -9 12 -13 M173 53 q10 -6 18 -7 M183 70 q11 -2 19 3" fill="none" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/>
    ${mouth}
    ${pose === "read" ? arms : ""}
    ${book}`,
  );
}

/** The three inked spot illustrations for the manga panels. kind: "lang" | "create" | "fund". */
export function spot(kind) {
  const bubble = (x, y, w, h, fill, rot, tail, label, size) =>
    `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><path d="M${x + 14} ${y} H${x + w - 14} Q${x + w} ${y} ${x + w} ${y + 14} V${y + h - 14} Q${x + w} ${y + h} ${x + w - 14} ${y + h} H${x + (tail === "l" ? 46 : w - 30)} L${x + (tail === "l" ? 22 : w - 12)} ${y + h + 22} L${x + (tail === "l" ? 28 : w - 38)} ${y + h} H${x + 14} Q${x} ${y + h} ${x} ${y + h - 14} V${y + 14} Q${x} ${y} ${x + 14} ${y} Z" fill="${fill}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><text x="${x + w / 2}" y="${y + h / 2 + size * 0.34}" text-anchor="middle" font-size="${size}" font-weight="800" fill="${INK}" class="spot-text">${label}</text></g>`;
  if (kind === "lang") {
    return SVG(
      "spot spot--lang",
      "0 0 260 210",
      `${bubble(14, 22, 132, 70, AMBER, -6, "l", "Hello", 30)}${bubble(112, 62, 138, 70, PURPLE, 5, "r", "Bonjour", 28)}${bubble(30, 132, 124, 60, "#e8f1ff", -3, "l", "Hola", 30)}
       ${sparkle(236, 36, 1.1, "#fff")}${sparkle(20, 118, 0.7, INK)}`,
    );
  }
  if (kind === "create") {
    const card = (rot, fill, icon) =>
      `<g transform="rotate(${rot} 130 130)"><rect x="82" y="46" width="96" height="124" rx="12" fill="${fill}" stroke="${INK}" stroke-width="5"/>${icon}</g>`;
    return SVG(
      "spot spot--create",
      "0 0 260 210",
      `${card(-16, BLUE, `<circle cx="130" cy="92" r="14" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M102 150 Q130 116 158 150" fill="#fff" stroke="${INK}" stroke-width="4"/>`)}
       ${card(0, AMBER, `<path d="M130 76 l8 18 20 2 -15 13 5 20 -18 -10 -18 10 5 -20 -15 -13 20 -2 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`)}
       ${card(16, PURPLE, `<path d="M130 138 C96 114 108 82 130 98 C152 82 164 114 130 138 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`)}
       <g transform="translate(176 188) rotate(-42)"><rect x="0" y="-11" width="26" height="22" rx="4" fill="${PINK}" stroke="${INK}" stroke-width="5"/><rect x="26" y="-11" width="10" height="22" fill="#d4d4d8" stroke="${INK}" stroke-width="5"/><rect x="36" y="-11" width="76" height="22" fill="${GOLD}" stroke="${INK}" stroke-width="5"/><path d="M48 -11 V11 M62 -11 V11" stroke="${INK}" stroke-width="3" opacity=".5"/><path d="M112 -11 L146 0 L112 11 Z" fill="#f3d6a5" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M134 -4 L146 0 L134 4 Z" fill="${INK}"/></g>
       ${sparkle(34, 40, 1.1, "#fff")}${sparkle(228, 54, 0.8, "#fff")}${sparkle(214, 30, 0.5, AMBER)}`,
    );
  }
  const coin = (cy, fill) =>
    `<ellipse cx="130" cy="${cy + 14}" rx="62" ry="20" fill="${fill}" stroke="${INK}" stroke-width="5"/><rect x="68" y="${cy - 2}" width="124" height="16" fill="${fill}"/><path d="M68 ${cy - 2} V${cy + 14} M192 ${cy - 2} V${cy + 14}" stroke="${INK}" stroke-width="5"/><ellipse cx="130" cy="${cy - 2}" rx="62" ry="20" fill="${fill}" stroke="${INK}" stroke-width="5"/><ellipse cx="130" cy="${cy - 2}" rx="40" ry="11" fill="none" stroke="${INK}" stroke-width="3" opacity=".45"/>`;
  return SVG(
    "spot spot--fund",
    "0 0 260 210",
    `${coin(168, GOLD)}${coin(140, "#ffe29e")}${coin(112, GOLD)}
     <path d="M130 94 C128 68 132 52 126 34" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M130 94 C128 68 132 52 126 34" fill="none" stroke="${GREEN}" stroke-width="6" stroke-linecap="round"/>
     <path d="M127 58 C98 62 80 44 78 22 C104 22 122 34 127 58 Z" fill="${GREEN}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M129 46 C158 46 178 30 182 8 C154 8 134 22 129 46 Z" fill="#5eead4" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
     <path d="M127 58 C112 48 100 38 90 30 M129 46 C146 36 160 26 172 16" stroke="${INK}" stroke-width="3" fill="none" opacity=".5"/>
     <circle cx="38" cy="150" r="17" fill="${GOLD}" stroke="${INK}" stroke-width="5"/><path d="M38 141 v18 M31 150 h14" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="224" cy="120" r="13" fill="${GOLD}" stroke="${INK}" stroke-width="5"/><path d="M224 113 v14 M217 120 h14" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
     ${sparkle(212, 56, 1, "#fff")}${sparkle(48, 70, 0.7, "#fff")}${sparkle(236, 168, 0.6, AMBER)}`,
  );
}

/**
 * "Form study": a technical construction drawing of the mascot's eye (dashed guides, centre lines, dimensions),
 * the SEEN counterpart to a pattern-maker's drawing. Line art only, decorative.
 */
export function study() {
  const L = "rgba(255,255,255,.9)";
  const dim = "rgba(255,255,255,.4)";
  return SVG(
    "study-art",
    "0 0 340 340",
    `<g fill="none" stroke-linecap="round">
      <circle cx="170" cy="170" r="150" stroke="${dim}" stroke-width="1.2" stroke-dasharray="3 7"/>
      <path d="M170 8 V332 M8 170 H332" stroke="${dim}" stroke-width="1" stroke-dasharray="2 6"/>
      <circle cx="170" cy="170" r="104" stroke="${L}" stroke-width="2.2"/>
      <circle cx="170" cy="170" r="46" stroke="${PURPLE}" stroke-width="2.2"/>
      <circle cx="170" cy="170" r="18" stroke="${L}" stroke-width="1.6"/>
      <circle cx="154" cy="152" r="9" stroke="${L}" stroke-width="1.4" stroke-dasharray="2 4"/>
      <path d="M222 80 L232 64 M250 103 L266 92 M268 134 L286 128" stroke="${L}" stroke-width="2.4"/>
      <path d="M146 224 q24 16 48 0" stroke="${L}" stroke-width="2.2"/>
      <ellipse cx="136" cy="318" rx="22" ry="9" stroke="${L}" stroke-width="2"/><ellipse cx="204" cy="318" rx="22" ry="9" stroke="${L}" stroke-width="2"/>
      <path d="M66 170 H124 M216 170 H274" stroke="${PURPLE}" stroke-width="1.2" stroke-dasharray="2 4"/>
      <path d="M66 62 H274" stroke="${dim}" stroke-width="1"/><path d="M66 56 V68 M274 56 V68" stroke="${dim}" stroke-width="1"/>
      <path d="M300 66 V274" stroke="${dim}" stroke-width="1"/><path d="M294 66 H306 M294 274 H306" stroke="${dim}" stroke-width="1"/>
    </g>
    <g fill="${L}" font-size="9.5" letter-spacing="1.4" style="font-family:ui-monospace,Menlo,Consolas,monospace">
      <text x="170" y="50" text-anchor="middle" fill="${dim}">&#216; 208</text>
      <text x="318" y="174" text-anchor="middle" fill="${dim}" transform="rotate(90 318 174)">&#216; 208</text>
      <text x="170" y="236" text-anchor="middle" fill="${PURPLE}">IRIS</text>
      
    </g>
    ${sparkle(292, 40, 0.9, "#fff")}${sparkle(40, 296, 0.6, PURPLE)}`,
  ).replace(' style="font-family:ui-monospace,Menlo,Consolas,monospace"', ' class="mono-svg"');
}
