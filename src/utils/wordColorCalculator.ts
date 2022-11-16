import chroma from 'chroma-js';

// Contrast calculations https://stackoverflow.com/a/11868398
type CalcOptions = {
  lightMax?: number;
  lightMin?: number;
  chromaMax?: number;
  chromaMin?: number;
};

const defaultOptions = {
  lightMax: 95,
  lightMin: 70,
  chromaMax: 20,
  chromaMin: 5,
};

// Based on https://stackoverflow.com/a/13532993
const shadeColor = (color: string, percent: number) =>
  `#${[
    parseInt(color.substring(1, 3), 16),
    parseInt(color.substring(3, 5), 16),
    parseInt(color.substring(5, 7), 16),
  ]
    .map((c) => {
      let a = parseInt(((c * (100 + percent)) / 100).toString(), 10);
      const b = (a = a < 255 ? a : 255).toString(16);
      return b.length === 1 ? `0${b}` : b;
    })
    .join('')}`;

// Details on hash algo https://stackoverflow.com/a/33647870
function getHash(str: string) {
  let hash = 0;
  let i = 0;
  const len = str.length;
  while (i < len) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) << 0;
    i += 1;
  }
  return hash;
}

export function positiveHash(str: string) {
  return getHash(str) + 2147483647 + 1;
}

function darkIsContrast(c: string) {
  const hexcolor = c.replace('#', '');
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 141;
}

export function calcWordColor(word: string, config?: CalcOptions) {
  const lightMax = config?.lightMax || 95;
  const lightMin = config?.lightMin || 70;
  const chromaMax = config?.chromaMax || 20;
  const chromaMin = config?.chromaMin || 5;

  const first = positiveHash(getHash(word).toString());
  const second = positiveHash(first.toString());
  const third = positiveHash(second.toString());

  const between = (hash: number, from: number, to: number) =>
    (hash % (to - from)) + from;
  return chroma
    .lch(
      between(first, lightMin, lightMax) / 100,
      between(second, chromaMin, chromaMax) / 100,
      between(third, 0, 360),
    )
    .hex();
}

/**
 * 计算默认的样式 背景色 边框 文本样式
 * @param nodeLabel
 * @param config
 * @returns Object
 */
export function calculateDefaultNodeColors(
  nodeLabel: string,
  config = defaultOptions,
) {
  const bkg = calcWordColor(nodeLabel, config);
  const border = shadeColor(bkg, -20);
  const text = darkIsContrast(bkg) ? '#2A2C34' : '#FFFFFF';
  return {
    backgroundColor: bkg,
    borderColor: border,
    textColor: text,
  };
}
