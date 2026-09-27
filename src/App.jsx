import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import "./App.css";

const BasicEditor = lazy(() => import("./BasicEditor"));

const STORAGE_KEY = "react-editor:project:v1";
const PROJECT_FILES = ["/App.jsx", "/styles.css", "/index.jsx"];

const STARTER_FILES = {
  "/App.jsx": `import { useState } from "react";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="demo-card">
      <span className="eyebrow">CANLI REACT ÖNİZLEMESİ</span>
      <h1>Fikrini kodla.</h1>
      <p>
        Soldaki dosyaları düzenle; yaptığın değişiklikleri burada anında gör.
      </p>

      <button onClick={() => setCount((value) => value + 1)}>
        Sayaç: {count}
      </button>
    </main>
  );
}
`,
  "/styles.css": `:root {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  color: #182230;
  background: #f4f7fb;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
}

.demo-card {
  width: min(100%, 560px);
  padding: 48px;
  border: 1px solid #e4e9f2;
  border-radius: 24px;
  background: white;
  box-shadow: 0 24px 70px rgba(35, 49, 82, 0.12);
}

.eyebrow {
  color: #6d5dfc;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

h1 {
  margin: 14px 0 12px;
  font-size: clamp(36px, 7vw, 64px);
  line-height: 0.95;
  letter-spacing: -0.06em;
}

p {
  margin: 0 0 28px;
  color: #607086;
  font-size: 17px;
  line-height: 1.7;
}

button {
  border: 0;
  border-radius: 12px;
  padding: 13px 18px;
  color: white;
  background: #6d5dfc;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background: #5848e8;
}
`,
  "/index.jsx": `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
};

function loadLocalProject() {
  try {
    const savedProject = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const hasAllFiles = PROJECT_FILES.every(
      (path) => typeof savedProject?.[path] === "string",
    );

    return hasAllFiles ? savedProject : STARTER_FILES;
  } catch {
    return STARTER_FILES;
  }
}

function CodeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m8.4 16.8-4.8-4.8 4.8-4.8M15.6 7.2l4.8 4.8-4.8 4.8M14 4l-4 16" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.17-1.11-1.48-1.11-1.48-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.82c.85 0 1.71.12 2.51.34 1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function Workspace() {
  const { sandpack, listen } = useSandpack();
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [runtimeStatus, setRuntimeStatus] = useState("initial");
  const [saveStatus, setSaveStatus] = useState("Yerel proje hazır");
  const saveTimer = useRef();

  useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === "start") {
        setRuntimeStatus("compiling");
      }

      if (message.type === "done") {
        setRuntimeStatus(message.compilatonError ? "error" : "ready");
      }

      if (
        message.type === "action" &&
        (message.action === "show-error" ||
          (message.action === "notification" &&
            message.notificationType === "error"))
      ) {
        setRuntimeStatus("error");
      }
    });

    return unsubscribe;
  }, [listen]);

  useEffect(() => {
    if (sandpack.status === "timeout" || sandpack.error) {
      setRuntimeStatus("error");
    }
  }, [sandpack.error, sandpack.status]);

  useEffect(() => {
    setSaveStatus("Kaydediliyor…");
    window.clearTimeout(saveTimer.current);

    saveTimer.current = window.setTimeout(() => {
      const localFiles = Object.fromEntries(
        PROJECT_FILES.map((path) => [path, sandpack.files[path]?.code ?? ""]),
      );

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localFiles));
        setSaveStatus("Bu cihazda kaydedildi");
      } catch {
        setSaveStatus("Yerel kayıt başarısız");
      }
    }, 500);

    return () => window.clearTimeout(saveTimer.current);
  }, [sandpack.files]);

  const resetProject = () => {
    const shouldReset = window.confirm(
      "Tüm değişiklikler silinip örnek projeye dönülsün mü?",
    );

    if (!shouldReset) return;

    sandpack.updateFile(STARTER_FILES, undefined, true);
    sandpack.setActiveFile("/App.jsx");
  };

  const runProject = async () => {
    setRuntimeStatus("compiling");
    await sandpack.runSandpack();
  };

  const runtimeLabel = {
    initial: "Başlatılıyor",
    compiling: "Derleniyor",
    ready: "Hazır",
    error: "Hata var",
  }[runtimeStatus];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <CodeIcon />
          </span>
          <span>
            <strong>React Editor</strong>
            <small>Tarayıcıda çalışır</small>
          </span>
        </div>

        <div className="topbar-actions">
          <div className="save-state" title="Proje kalıcı olarak yalnızca bu tarayıcıda saklanır">
            <span className="save-dot" />
            {saveStatus}
          </div>
          <a className="button button-secondary route-link" href="/basic">
            Basic sürüm
          </a>
          <button
            className="button button-secondary reset-button"
            onClick={resetProject}
          >
            Örneğe dön
          </button>
          <button className="button button-primary" onClick={runProject}>
            <span className="play-icon">▶</span>
            Çalıştır
          </button>
          <a
            className="icon-link"
            href="https://github.com/anilcanboga/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profilini aç"
          >
            <GithubIcon />
          </a>
        </div>
      </header>

      <main className="workspace">
        <aside className="files-panel panel">
          <div className="panel-heading">
            <span>DOSYALAR</span>
            <span className="file-count">3</span>
          </div>
          <SandpackFileExplorer autoHiddenFiles />
          <div className="local-note">
            <span>●</span>
            <p>Hesap veya veritabanı yok. Değişiklikler bu tarayıcıda saklanır.</p>
          </div>
        </aside>

        <section className="editor-panel panel" aria-label="Kod editörü">
          <SandpackCodeEditor
            showTabs
            showLineNumbers
            showInlineErrors
            wrapContent={false}
          />
        </section>

        <section className="output-panel panel" aria-label="Uygulama çıktısı">
          <div className="output-toolbar">
            <div className="output-tabs" aria-label="Çıktı görünümü">
              <span className="output-tab active">Önizleme</span>
              <button
                className={consoleOpen ? "output-tab active" : "output-tab"}
                onClick={() => setConsoleOpen((open) => !open)}
                aria-expanded={consoleOpen}
              >
                Console
              </button>
            </div>
            <span className={`runtime-state runtime-${runtimeStatus}`}>
              <span />
              {runtimeLabel}
            </span>
          </div>

          <div className={consoleOpen ? "preview-area" : "preview-area console-closed"}>
            <SandpackPreview
              showNavigator={false}
              showOpenInCodeSandbox={false}
              showOpenNewtab
              showRefreshButton
              showRestartButton
              showSandpackErrorOverlay
            />

            {consoleOpen && (
              <div className="console-panel">
                <SandpackConsole
                  showHeader={false}
                  showSyntaxError
                  showSetupProgress
                  showRestartButton={false}
                  showResetConsoleButton
                  resetOnPreviewRestart
                />
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="statusbar">
        <span>React JSX</span>
        <span>UTF-8</span>
        <span>Yerel çalışma alanı</span>
      </footer>
    </div>
  );
}

function AdvancedEditor() {
  const [initialFiles] = useState(loadLocalProject);

  return (
    <SandpackProvider
      template="vite-react"
      theme="dark"
      files={initialFiles}
      options={{
        activeFile: "/App.jsx",
        visibleFiles: PROJECT_FILES,
        autorun: true,
        autoReload: true,
        recompileMode: "delayed",
        recompileDelay: 500,
      }}
    >
      <Workspace />
    </SandpackProvider>
  );
}

export default function App() {
  const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";

  if (normalizedPath === "/basic") {
    return (
      <Suspense fallback={<div className="route-loading">Basic editör yükleniyor…</div>}>
        <BasicEditor />
      </Suspense>
    );
  }

  return <AdvancedEditor />;
}
