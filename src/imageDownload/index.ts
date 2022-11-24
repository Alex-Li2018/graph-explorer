export type DataUrlType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/webp'
  | 'image/bmp';

export interface DownloadImageOptions {
  scale: number;
  format: DataUrlType;
  quality: number;
  download: boolean;
  cssinline: number;
  ignore?: boolean | null;
  background?: string | null;
}

function inlineStyles(source: Element, target: Element) {
  // inline style from source element to the target (detached) one
  const computed = window.getComputedStyle(source);
  for (const styleKey of Array.prototype.slice.call(computed)) {
    (target as HTMLElement).style[styleKey] = computed[styleKey];
  }

  // recursively call inlineStyles for the element children
  for (let i = 0; i < source.children.length; i++) {
    inlineStyles(source.children[i], target.children[i]);
  }
}

function copyToCanvas(
  source: Element,
  target: Element,
  scale: number,
  format: DataUrlType,
  quality: number,
): Promise<string> {
  const svgData = new XMLSerializer().serializeToString(target);
  const canvas = document.createElement('canvas');
  const svgSize = source.getBoundingClientRect();

  //Resize can break shadows
  canvas.width = svgSize.width * scale;
  canvas.height = svgSize.height * scale;
  canvas.style.width = `${svgSize.width}`;
  canvas.style.height = `${svgSize.height}`;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(scale, scale);

  const img = document.createElement('img');

  img.setAttribute(
    'src',
    'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData))),
  );
  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL(format, quality));
    };
  });
}

function downloadImage(file: string, name: string, format: string) {
  const a = document.createElement('a');
  a.download = `${name}.${format.split('/')[1]}`;
  a.href = file;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function updateConfig(options?: DownloadImageOptions) {
  return Object.assign(options || {}, {
    scale: 1,
    format: 'image/png',
    quality: 0.92,
    download: true,
    ignore: null,
    cssinline: 1,
    background: null,
  });
}

export async function svgToImageDownload(
  sourceDom: Element | string,
  fileName?: string,
  options?: DownloadImageOptions,
) {
  const { scale, format, quality, download, ignore, cssinline, background } =
    updateConfig(options);

  // Accept a selector or directly a DOM Element
  const source = (
    sourceDom instanceof Element
      ? sourceDom
      : document.querySelector<HTMLElement>(sourceDom)
  ) as HTMLInputElement;

  // Create a new SVG element similar to the source one to avoid modifying the
  // source element.
  const target = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  target.innerHTML = (source as Element).innerHTML;

  for (const attr of Array.prototype.slice.call(
    (source as Element).attributes,
  )) {
    target.setAttribute(attr.name, attr.value);
  }

  // Set all the css styles inline on the target element based on the styles
  // of the source element
  if (cssinline === 1) {
    inlineStyles(source, target);
  }

  if (background) {
    target.style.background = background;
  }

  //Remove unwanted elements
  if (ignore !== null) {
    const elt = target.querySelector<HTMLElement>(ignore) as HTMLInputElement;
    (elt.parentNode as HTMLElement).removeChild(elt);
  }

  //Copy all html to a new canvas
  const file = await copyToCanvas(
    source,
    target,
    scale,
    format as DataUrlType,
    quality,
  );

  if (download) {
    downloadImage(file, fileName || 'graph', format);
  }

  return file;
}
