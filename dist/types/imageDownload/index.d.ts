export declare type DataUrlType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/bmp';
export interface DownloadImageOptions {
    scale: number;
    format: DataUrlType;
    quality: number;
    download: boolean;
    cssinline: number;
    ignore?: boolean | null;
    background?: string | null;
}
export declare function svgToImageDownload(sourceDom: Element | string, fileName?: string, options?: DownloadImageOptions): Promise<string>;
