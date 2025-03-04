declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'swagger-ui-react/swagger-ui.css'; 