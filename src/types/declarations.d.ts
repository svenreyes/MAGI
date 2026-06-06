/**
 * Ambient module declarations for non-code imports handled by the Metro
 * bundler (NativeWind / CSS interop). These keep the TypeScript compiler happy
 * for side-effect and CSS-module imports.
 */
declare module '*.css';

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
