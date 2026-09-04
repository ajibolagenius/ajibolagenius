const LANGUAGE_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("portfolio_locale");
    if (stored === "yo") document.documentElement.lang = "yo";
  } catch (e) {}
})();
`;

export function LanguageScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: LANGUAGE_INIT_SCRIPT }} />;
}
