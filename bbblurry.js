// Generative Utils: https://github.com/georgedoescode/generative-utils, MIT licensed
import {
  random
} from "/scripts/generative-utils.min.js";
import fileSaver from 'https://cdn.skypack.dev/pin/file-saver@v2.0.5-UsWqrW8RsYF08S1pEHIw/mode=imports,min/optimized/file-saver.js';

let width = 800;
let height = 800;

let shapeGroup;
let balls = [];

const svg = SVG()
  .viewbox(0, 0, width, height)
  .addTo("#bbblurry-wrapper")
  .attr("id", "bbblurry");

function generate(fills = ['hsl(37, 99%, 67%)', 'hsl(316, 73%, 52%)', 'hsl(185, 100%, 57%)'], size = 300) {
  svg.clear();
  balls = [];

  svg.defs().add(`<filter id="bbblurry-filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
	<feGaussianBlur stdDeviation="40" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"/></filter>`);

  shapeGroup = svg.group().attr('filter', 'url(#bbblurry-filter)');

  const halfSize = size / 2;
  fills.forEach(fill => {
    balls.push(shapeGroup.ellipse(size, size).cx(random(0 + halfSize, width - halfSize)).cy(random(0 + halfSize, height - halfSize)).fill(fill).draggable());
  });
  
}
window.generate = generate;
generate();

function updateBlur(blurAmount) {
  svg.defs().clear();
  svg.defs().add(`<filter id="bbblurry-filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
	<feGaussianBlur stdDeviation="${ blurAmount }" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"/></filter>`);
}
window.updateBlur = updateBlur;

function updateColor(color, ballIndex) {
  balls.map((ball, idx) => {
    if (idx === ballIndex) {
      ball.fill(color);
    }
  });
}
window.updateColor = updateColor;


function updateSize(sizeX, sizeY) {
  balls.forEach(ball => {
    ball.size(+sizeX, +sizeY);
  });
}
window.updateSize = updateSize;


function addBall(fill, sizeX, sizeY) {
  const halfSize = sizeX / 2;
  balls.push(shapeGroup.ellipse(+sizeX, +sizeY).cx(random(0 + halfSize, width - halfSize)).cy(random(0 + halfSize, height - halfSize)).fill(fill).draggable());
}


function removeColor(colors, index) {
  const newColors = colors.filter((val, idx) => {
    return index !== idx;
  });
  
  balls.map((ball, idx) => {
    if (index === idx) {
      ball.remove();
    }
  });

  balls = balls.filter((ball, idx) => {
    return index !== idx;
  });

  return newColors;
}
window.removeColor = removeColor;

function addColor(colors, sizeX = 300, sizeY = 300) {
  // const newClr = random(['#2FDD92', '#000D6B', '#0F00FF', '#BCCC9A', '#FF0075', '#FEE440', '#406343', '#7027A0', '#FF5C58', '#C1FFD7', '#FFC069', '#3DB2FF', '#DF711B', '#FF6767']);
  const newClr = random(['hsl(11, 100%, 65%)', 'hsl(108, 100%, 80%)', 'hsl(182, 100%, 67%)', 'hsl(286, 100%, 68%)', 'hsl(67, 100%, 89%)', 'hsl(152, 100%, 70%)', 'hsl(208, 100%, 86%)', 'hsl(54, 100%, 82%)', 'hsl(142, 100%, 89%)', 'hsl(55, 100%, 85%)', 'hsl(325, 100%, 63%)', 'hsl(58, 100%, 71%)', 'hsl(25, 100%, 64%)', 'hsl(162, 100%, 67%)']);
  const newColors = [...colors, newClr];
  addBall(newClr, sizeX, sizeY);
  return newColors;
}
window.addColor = addColor;

function setOpacity(value) {
  svg.opacity(value);
}
window.setOpacity = setOpacity;


function updateRatio(ratio) {
  if (ratio === '1:1') {
    width = 800;
    height = 800;
  } else if (ratio === '4:5') {
    width = 640;
    height = 800;
  } else {
    width = 800;
    height = 450;
  }

  svg.viewbox(0, 0, width, height);
}
window.updateRatio = updateRatio;


const svgEl = document.querySelector('#bbblurry');

function copy(el) {
    svgEl.removeAttribute('id');
    const svgMarkup = svg.svg();
    svg.attr('id', 'bbblurry');
    copyTextToClipboard(svgMarkup, el);
}
window.copy = copy;

function download(el) {
  svgEl.removeAttribute('id');
  const svgMarkup = svg.svg();
  svg.attr('id', 'bbblurry');
  const svgBlob = new Blob([svgMarkup], {
    type: 'text/plain;charset=utf-8',
  });
  fileSaver.saveAs(svgBlob, "bbblurry.svg");
}
window.download = download;

// copy text

// Inspired from answer: https://stackoverflow.com/a/30810322 by Dean Taylor: https://stackoverflow.com/users/406712/dean-taylor
function copyTextToClipboard(text, el) {
  navigator.clipboard.writeText(text).then(
    function () {
      const originalText = el.innerHTML;
      el.classList.add('bounce');

      // Feather icons: https://feathericons.com/, MIT licensed
      el.innerHTML = `<svg class="inline" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> <span class="hidden sm:inline">copied!</span>`;

      setTimeout(() => {
        el.classList.remove('bounce');
        el.innerHTML = originalText;
      }, 1500);
    },
    function (err) {
      console.error('Async: Could not copy text: ', err);
    }
  );
}
