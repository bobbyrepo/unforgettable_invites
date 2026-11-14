// Ambient module declarations for style and asset imports
// Resolves TS2882 (noUncheckedSideEffectImports) in TypeScript 5.3+ / 5.7+

declare module '*.css' {
  const content: { readonly [key: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { readonly [key: string]: string };
  export default content;
}

declare module '*.sass' {
  const content: { readonly [key: string]: string };
  export default content;
}

declare module '*.less' {
  const content: { readonly [key: string]: string };
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.webp' {
  const content: any;
  export default content;
}
