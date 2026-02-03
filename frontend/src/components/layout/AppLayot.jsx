import { useThemeStore } from "../components/UseThemeStore";

function AppLayout({ children }) {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme} className="min-h-screen">
      {children}
    </div>
  );
}

export default AppLayout;
