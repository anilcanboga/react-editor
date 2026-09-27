import React from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import "./BasicEditor.css";

const BASIC_CODE = `
const App = () => {
  const [count, setCount] = React.useState(0);

  const handleClick = () => {
    setCount((previousCount) => previousCount + 1);
  };

  React.useEffect(() => {
    console.log("Sayı değişti: " + count);
  }, [count]);

  return (
    <div>
      <h1>Sayı: {count}</h1>
      <br />
      <button onClick={handleClick}>Arttır</button>
    </div>
  );
};

render(<App />);
`;

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.82-.26.82-.58v-2.04c-3.34.72-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.2.09 1.85 1.25 1.85 1.25 1.08 1.84 2.83 1.31 3.52 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.17 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.29c1.02 0 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.23v3.31c0 .32.22.69.83.57A12 12 0 0 0 12 .3Z" />
    </svg>
  );
}

export default function BasicEditor() {
  return (
    <div className="basic-page">
      <LiveProvider code={BASIC_CODE} noInline scope={{ React }}>
        <div className="basic-editor-layout">
          <div className="basic-editor-pane">
            <LiveEditor aria-label="Basic React kod editörü" />
          </div>
          <div className="basic-preview-pane">
            <LivePreview />
          </div>
        </div>

        <div className="basic-footer">
          <a className="basic-back-link" href="/">
            <span aria-hidden="true">←</span>
            Gelişmiş editöre dön
          </a>
          <LiveError className="basic-live-error" />
          <a
            className="basic-github-link"
            href="https://github.com/anilcanboga/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
            GitHub
          </a>
        </div>
      </LiveProvider>
    </div>
  );
}
