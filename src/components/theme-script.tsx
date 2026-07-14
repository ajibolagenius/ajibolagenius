const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var isDark;
    if (stored) {
      isDark = stored === "dark";
    } else {
      var hour = new Date().getHours();
      isDark = hour < 6 || hour >= 18;
    }
    if (isDark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
