import ThemeSelector from "../utils/ThemeSelector/ThemeSelector";

function ThemePage() {
    return (
        <div className="min-h-screen p-6">
            <div className="card align-center">
                <h1 className="text-2xl font-bold mb-2">Theme Settings</h1>
                <p className="text-sm opacity-70 mb-6">
                    Choose how your app looks
                </p>

                <ThemeSelector />
            </div>

        </div>
    );
}

export default ThemePage;
