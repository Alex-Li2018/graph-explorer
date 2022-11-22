declare type CalcOptions = {
    lightMax?: number;
    lightMin?: number;
    chromaMax?: number;
    chromaMin?: number;
};
export declare function positiveHash(str: string): number;
export declare function calcWordColor(word: string, config?: CalcOptions): string;
/**
 * 计算默认的样式 背景色 边框 文本样式
 * @param nodeLabel
 * @param config
 * @returns Object
 */
export declare function calculateDefaultNodeColors(nodeLabel: string, config?: {
    lightMax: number;
    lightMin: number;
    chromaMax: number;
    chromaMin: number;
}): {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
};
export {};
