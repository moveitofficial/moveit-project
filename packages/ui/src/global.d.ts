declare module '*.svg' {
  const content: {
    readonly src: string;
    readonly height: number;
    readonly width: number;
    readonly blurDataURL?: string;
    readonly blurWidth?: number;
    readonly blurHeight?: number;
  };
  export default content;
}
