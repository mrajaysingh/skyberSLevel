(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/backup/skyber-full/frontend/components/security/skybersecutity.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SkyberSecutity",
    ()=>SkyberSecutity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/next@16.0.1_@babel+core@7.2_048eab391ea2e03c70ee64ac0670005b/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/next@16.0.1_@babel+core@7.2_048eab391ea2e03c70ee64ac0670005b/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/next@16.0.1_@babel+core@7.2_048eab391ea2e03c70ee64ac0670005b/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function SkyberSecutity({ children, fallback }) {
    _s();
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SkyberSecutity.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const sessionToken = localStorage.getItem("sessionToken");
                const authenticated = !!sessionToken;
                setIsAuthenticated(authenticated);
                if (!authenticated) {
                    // Store current path for redirect after login
                    sessionStorage.setItem("skyber_redirect_after_login", window.location.pathname);
                    router.push("/login");
                }
            }
        }
    }["SkyberSecutity.useEffect"], [
        router
    ]);
    // Show nothing while checking authentication
    if (isAuthenticated === null) {
        return fallback || null;
    }
    // Show nothing if not authenticated (redirect will happen)
    if (!isAuthenticated) {
        return fallback || null;
    }
    // Show protected content if authenticated
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(SkyberSecutity, "nzonxlEY4BnQFLufoeYb1M3pCFc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SkyberSecutity;
var _c;
__turbopack_context__.k.register(_c, "SkyberSecutity");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/backup/skyber-full/frontend/components/dashboard/dashboard-theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardThemeProvider",
    ()=>DashboardThemeProvider,
    "useDashboardTheme",
    ()=>useDashboardTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/next@16.0.1_@babel+core@7.2_048eab391ea2e03c70ee64ac0670005b/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/next@16.0.1_@babel+core@7.2_048eab391ea2e03c70ee64ac0670005b/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const DashboardThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useDashboardTheme = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(DashboardThemeContext);
    if (!context) {
        throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
    }
    return context;
};
_s(useDashboardTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function DashboardThemeProvider({ children }) {
    _s1();
    // Default to light to avoid low-contrast text on first paint
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("light");
    // Load theme from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardThemeProvider.useEffect": ()=>{
            const savedTheme = localStorage.getItem("dashboard-theme");
            if (savedTheme === "light" || savedTheme === "dark") {
                setThemeState(savedTheme);
            }
        }
    }["DashboardThemeProvider.useEffect"], []);
    // Apply/remove the global .dark class so Tailwind CSS variables (bg-background, text-foreground, etc.) work
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardThemeProvider.useEffect": ()=>{
            const root = document.documentElement;
            if (theme === "dark") {
                root.classList.add("dark");
                root.style.colorScheme = "dark";
            } else {
                root.classList.remove("dark");
                root.style.colorScheme = "light";
            }
            root.setAttribute("data-dashboard-theme", theme);
        }
    }["DashboardThemeProvider.useEffect"], [
        theme
    ]);
    const setTheme = (newTheme)=>{
        setThemeState(newTheme);
        try {
            localStorage.setItem("dashboard-theme", newTheme);
        } catch  {}
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardThemeContext.Provider, {
        value: {
            theme,
            setTheme
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-dashboard-theme": theme,
            className: theme === "dark" ? "dark-dashboard" : "light-dashboard",
            children: children
        }, void 0, false, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/dashboard-theme-provider.tsx",
            lineNumber: 56,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/dashboard-theme-provider.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s1(DashboardThemeProvider, "4qnaGxhbNgtHY1oJLugblNa43vo=");
_c = DashboardThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "DashboardThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SuperAdminSidebar",
    ()=>SuperAdminSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/next@16.0.1_@babel+core@7.2_048eab391ea2e03c70ee64ac0670005b/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/next@16.0.1_@babel+core@7.2_048eab391ea2e03c70ee64ac0670005b/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/next@16.0.1_@babel+core@7.2_048eab391ea2e03c70ee64ac0670005b/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/next@16.0.1_@babel+core@7.2_048eab391ea2e03c70ee64ac0670005b/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/next@16.0.1_@babel+core@7.2_048eab391ea2e03c70ee64ac0670005b/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$dashboard$2f$dashboard$2d$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/components/dashboard/dashboard-theme-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/server.js [app-client] (ecmascript) <export default as Server>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/code.js [app-client] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/palette.js [app-client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/lucide-react@0.539.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$security$2f$page$2d$security$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/components/security/page-security.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const menuItems = [
    {
        id: 'visit-site',
        label: 'Visit Site',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
            lineNumber: 45,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        href: '/',
        target: '_blank',
        rel: 'noopener noreferrer'
    },
    {
        id: 'home',
        label: 'Home',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
            lineNumber: 53,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        href: '/auth/dashboards/user/super-admin'
    },
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
            lineNumber: 59,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        children: [
            {
                id: 'overview',
                label: 'Overview',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 64,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin'
            },
            {
                id: 'analytics',
                label: 'Analytics',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 70,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/analytics'
            }
        ]
    },
    {
        id: 'users',
        label: 'User Management',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
            lineNumber: 78,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        children: [
            {
                id: 'all-users',
                label: 'All Users',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 83,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/users'
            },
            {
                id: 'roles',
                label: 'Roles & Permissions',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 89,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/users/roles'
            },
            {
                id: 'activity',
                label: 'User Activity',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 95,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/users/activity'
            }
        ]
    },
    {
        id: 'system',
        label: 'System',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__["Server"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
            lineNumber: 103,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        children: [
            {
                id: 'database',
                label: 'Database',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 108,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/system/database'
            },
            {
                id: 'redis',
                label: 'Redis Cache',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 114,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/system/redis'
            },
            {
                id: 'servers',
                label: 'Servers',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__["Server"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 120,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/system/servers'
            },
            {
                id: 'logs',
                label: 'Logs',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 126,
                    columnNumber: 19
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/system/logs'
            }
        ]
    },
    {
        id: 'security',
        label: 'Security',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
            lineNumber: 134,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        children: [
            {
                id: 'sessions',
                label: 'Sessions',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 139,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/security/sessions'
            },
            {
                id: 'audit-log',
                label: 'Audit Log',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 145,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/security/audit'
            },
            {
                id: 'firewall',
                label: 'Firewall Rules',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 151,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/security/firewall'
            }
        ]
    },
    {
        id: 'content',
        label: 'Content',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
            lineNumber: 159,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        children: [
            {
                id: 'pages',
                label: 'Pages',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 164,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/content/pages'
            },
            {
                id: 'posts',
                label: 'Posts',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 170,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/content/posts'
            },
            {
                id: 'media',
                label: 'Media Library',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 176,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/content/media'
            }
        ]
    },
    {
        id: 'notifications',
        label: 'Notifications',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
            lineNumber: 184,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        href: '/auth/dashboards/user/super-admin/notifications'
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
            lineNumber: 190,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        children: [
            {
                id: 'general',
                label: 'General',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 195,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/settings/general'
            },
            {
                id: 'appearance',
                label: 'Appearance',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 201,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/settings/appearance'
            },
            {
                id: 'integrations',
                label: 'Integrations',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 207,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/settings/integrations'
            },
            {
                id: 'email',
                label: 'Email',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 213,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                href: '/auth/dashboards/user/super-admin/settings/email'
            }
        ]
    }
];
const SidebarItem = ({ item, isActive, isExpanded, onToggle, level = 0 })=>{
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$dashboard$2f$dashboard$2d$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardTheme"])();
    const hasChildren = item.children && item.children.length > 0;
    const isHome = item.id === 'home';
    const isVisit = item.id === 'visit-site';
    const isDark = theme === 'dark';
    // Check if any child is active
    const hasActiveChild = hasChildren && item.children?.some((child)=>child.href && pathname === child.href);
    if (hasChildren) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onToggle,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors rounded-lg", level > 0 && "pl-8", isHome ? isDark ? "text-[#17D492] bg-[#17D492]/15 hover:bg-[#17D492]/25" : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100" : isDark ? "text-gray-300 hover:text-white hover:bg-gray-800/50" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                item.icon,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: item.label
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                    lineNumber: 260,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                            lineNumber: 258,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                            lineNumber: 263,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                            lineNumber: 265,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 244,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-1 space-y-1",
                    children: item.children?.map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarItem, {
                            item: child,
                            isActive: pathname === child.href,
                            isExpanded: false,
                            onToggle: ()=>{},
                            level: level + 1
                        }, child.id, false, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                            lineNumber: 271,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                    lineNumber: 269,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
            lineNumber: 243,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: item.href || '#',
        target: item.target,
        rel: item.rel,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(isVisit ? "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-lg border" : "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg", level > 0 && "pl-8", isVisit ? isDark ? "bg-gray-900/40 text-gray-200 border-transparent hover:bg-black hover:text-white hover:border-white hover:rounded-[20px]" : "bg-gray-100 text-gray-800 border-transparent hover:bg-black hover:text-white hover:border-white hover:rounded-[20px]" : isHome || isActive ? isDark ? "text-[#17D492] bg-[#17D492]/15 hover:bg-[#17D492]/25" : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100" : isDark ? "text-gray-300 hover:text-white hover:bg-gray-800/50" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"),
        children: [
            item.icon,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: item.label
            }, void 0, false, {
                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                lineNumber: 310,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
        lineNumber: 287,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SidebarItem, "PnuR3uplqSm8SIOiTo8ATlGdUuE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$dashboard$2f$dashboard$2d$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardTheme"]
    ];
});
_c = SidebarItem;
function SuperAdminSidebar() {
    _s1();
    const [expandedItems, setExpandedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$dashboard$2f$dashboard$2d$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardTheme"])();
    const isDark = theme === 'dark';
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$security$2f$page$2d$security$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSecurity"])();
    const avatarSrc = user?.avatar || "/Default/profileImg/defaultProfile.png";
    const sidebarName = (()=>{
        const segments = [
            user?.firstName,
            user?.middleName,
            user?.lastName
        ].map((s)=>(s || "").trim()).filter(Boolean);
        if (segments.length) return segments.join(" ");
        return user?.name || "SKYBER User";
    })();
    const sidebarRole = (()=>{
        const base = user?.role;
        if (!base) return 'Super Admin';
        return base.split(/[-\s]+/).map((part)=>part ? part.charAt(0).toUpperCase() + part.slice(1) : part).join(' ');
    })();
    const [isProfileOpen, setIsProfileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const profileBtnRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const profileMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [profileMenuPos, setProfileMenuPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        top: 0,
        left: 0
    });
    const hoverState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        overBtn: false,
        overMenu: false,
        closeTimer: null
    });
    // Ensure component is mounted before allowing hover menu
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SuperAdminSidebar.useEffect": ()=>{
            setIsMounted(true);
        }
    }["SuperAdminSidebar.useEffect"], []);
    const scheduleCloseIfNotHovering = ()=>{
        const state = hoverState.current;
        if (state.closeTimer) {
            window.clearTimeout(state.closeTimer);
            state.closeTimer = null;
        }
        state.closeTimer = window.setTimeout(()=>{
            const s = hoverState.current;
            if (!s.overBtn && !s.overMenu) {
                setIsProfileOpen(false);
            }
        }, 150); // small delay to allow moving between button and menu
    };
    const updateProfileMenuPosition = ()=>{
        if (!profileBtnRef.current || ("TURBOPACK compile-time value", "object") === 'undefined') return;
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(()=>{
            if (!profileBtnRef.current) return;
            const rect = profileBtnRef.current.getBoundingClientRect();
            const intendedLeft = rect.right + 5; // 5px gap from sidebar
            let top = rect.top - 8;
            const menuEl = profileMenuRef.current;
            const menuHeight = menuEl?.offsetHeight ?? 0;
            const menuWidth = menuEl?.offsetWidth ?? 260;
            const minTop = 12;
            const maxTop = window.innerHeight - menuHeight - 12;
            top = Math.max(minTop, Math.min(top, maxTop));
            const viewportRight = window.innerWidth;
            const left = Math.min(intendedLeft, viewportRight - menuWidth - 5);
            setProfileMenuPos({
                top,
                left
            });
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SuperAdminSidebar.useEffect": ()=>{
            if (!isProfileOpen) return;
            // Ensure button ref is ready before positioning
            if (!profileBtnRef.current) {
                // Retry after a short delay if ref isn't ready
                const timer = setTimeout({
                    "SuperAdminSidebar.useEffect.timer": ()=>{
                        if (profileBtnRef.current) {
                            updateProfileMenuPosition();
                        }
                    }
                }["SuperAdminSidebar.useEffect.timer"], 50);
                return ({
                    "SuperAdminSidebar.useEffect": ()=>clearTimeout(timer)
                })["SuperAdminSidebar.useEffect"];
            }
            // position after mount and next frame to capture size
            updateProfileMenuPosition();
            requestAnimationFrame({
                "SuperAdminSidebar.useEffect": ()=>{
                    requestAnimationFrame({
                        "SuperAdminSidebar.useEffect": ()=>{
                            updateProfileMenuPosition();
                        }
                    }["SuperAdminSidebar.useEffect"]);
                }
            }["SuperAdminSidebar.useEffect"]);
            const handleClick = {
                "SuperAdminSidebar.useEffect.handleClick": (e)=>{
                    if (!profileMenuRef.current || !profileBtnRef.current) return;
                    if (!profileMenuRef.current.contains(e.target) && !profileBtnRef.current.contains(e.target)) {
                        setIsProfileOpen(false);
                    }
                }
            }["SuperAdminSidebar.useEffect.handleClick"];
            const handleResize = {
                "SuperAdminSidebar.useEffect.handleResize": ()=>updateProfileMenuPosition()
            }["SuperAdminSidebar.useEffect.handleResize"];
            window.addEventListener('click', handleClick);
            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleResize, true);
            return ({
                "SuperAdminSidebar.useEffect": ()=>{
                    window.removeEventListener('click', handleClick);
                    window.removeEventListener('resize', handleResize);
                    window.removeEventListener('scroll', handleResize, true);
                }
            })["SuperAdminSidebar.useEffect"];
        }
    }["SuperAdminSidebar.useEffect"], [
        isProfileOpen
    ]);
    // Close menu on route change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SuperAdminSidebar.useEffect": ()=>{
            setIsProfileOpen(false);
        }
    }["SuperAdminSidebar.useEffect"], [
        pathname
    ]);
    const toggleItem = (itemId)=>{
        setExpandedItems((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-0 top-0 h-screen w-64 border-r z-30 transition-colors flex flex-col", isDark ? "bg-black border-gray-800" : "bg-white border-gray-200"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6 h-16 border-b flex-shrink-0 flex items-center", isDark ? "border-gray-800 bg-black" : "border-gray-200 bg-white"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                className: "h-6 w-6 text-[#17D492]"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                lineNumber: 459,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-bold text-lg", isDark ? "text-white" : "text-gray-900"),
                                children: "SKYBER"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                lineNumber: 460,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                        lineNumber: 458,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xs mt-1", isDark ? "text-gray-400" : "text-gray-600"),
                        children: "Super Admin"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                        lineNumber: 465,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                lineNumber: 454,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scroll",
                children: menuItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarItem, {
                        item: item,
                        isActive: pathname === item.href || (item.children?.some((c)=>pathname === c.href) ?? false),
                        isExpanded: expandedItems.has(item.id),
                        onToggle: ()=>toggleItem(item.id)
                    }, item.id, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                        lineNumber: 474,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                lineNumber: 472,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6 py-4 border-t flex-shrink-0 relative", isDark ? "border-gray-800 bg-black" : "border-gray-200 bg-white"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        ref: profileBtnRef,
                        onClick: ()=>{
                            setIsProfileOpen((o)=>!o);
                            if (!isProfileOpen) {
                                // Small delay to ensure DOM is ready
                                setTimeout(()=>updateProfileMenuPosition(), 0);
                            }
                        },
                        onMouseEnter: ()=>{
                            if (!isMounted || !profileBtnRef.current) return;
                            hoverState.current.overBtn = true;
                            setIsProfileOpen(true);
                            // Use multiple requestAnimationFrame calls to ensure positioning happens after render
                            requestAnimationFrame(()=>{
                                requestAnimationFrame(()=>{
                                    updateProfileMenuPosition();
                                });
                            });
                        },
                        onMouseLeave: ()=>{
                            hoverState.current.overBtn = false;
                            scheduleCloseIfNotHovering();
                        },
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full flex items-center gap-3 px-2 py-2 mb-3 rounded-lg border transition-colors", isDark ? "border-gray-800 hover:bg-gray-900" : "border-gray-200 hover:bg-gray-100"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: avatarSrc,
                                alt: "User profile",
                                className: "h-8 w-8 rounded-full object-cover border border-gray-200"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                lineNumber: 518,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-medium", isDark ? "text-white" : "text-gray-900"),
                                        children: sidebarName
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                        lineNumber: 524,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xs", isDark ? "text-gray-500" : "text-gray-500"),
                                        children: sidebarRole
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                        lineNumber: 528,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                lineNumber: 523,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("ml-auto", isDark ? "text-gray-500" : "text-gray-400"),
                                children: isProfileOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                    lineNumber: 535,
                                    columnNumber: 6
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$539$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                    lineNumber: 537,
                                    columnNumber: 6
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                lineNumber: 533,
                                columnNumber: 4
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                        lineNumber: 489,
                        columnNumber: 9
                    }, this),
                    isProfileOpen && ("TURBOPACK compile-time value", "object") !== 'undefined' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: profileMenuRef,
                        style: {
                            top: profileMenuPos.top,
                            left: profileMenuPos.left
                        },
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-50 min-w-56 rounded-xl border shadow-xl p-3", isDark ? "bg-black/95 border-gray-800" : "bg-white border-gray-200"),
                        onMouseEnter: ()=>{
                            hoverState.current.overMenu = true;
                        },
                        onMouseLeave: ()=>{
                            hoverState.current.overMenu = false;
                            scheduleCloseIfNotHovering();
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-3 px-1 pb-3 border-b", isDark ? "border-gray-800" : "border-gray-200"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: avatarSrc,
                                        alt: "User profile",
                                        className: "h-9 w-9 rounded-full object-cover border border-gray-200"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                        lineNumber: 558,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-medium", isDark ? "text-white" : "text-gray-900"),
                                                children: sidebarName
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                                lineNumber: 564,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xs", isDark ? "text-gray-500" : "text-gray-500"),
                                                children: sidebarRole
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                                lineNumber: 568,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                        lineNumber: 563,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                lineNumber: 552,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-3 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/auth/dashboards/user/super-admin/profile",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("block text-sm px-3 py-2 rounded-md", isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"),
                                        onClick: ()=>setIsProfileOpen(false),
                                        children: "Edit Profile"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                        lineNumber: 575,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/auth/dashboards/user/super-admin/edit-site",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("block text-sm px-3 py-2 rounded-md", isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"),
                                        onClick: ()=>setIsProfileOpen(false),
                                        children: "Edit site"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                        lineNumber: 585,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                lineNumber: 574,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                        lineNumber: 542,
                        columnNumber: 11
                    }, this), document.body),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xs", isDark ? "text-gray-500" : "text-gray-400"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Version 1.0.0"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                lineNumber: 603,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1",
                                children: "© 2025 SKYBER"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                                lineNumber: 604,
                                columnNumber: 4
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                        lineNumber: 599,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
                lineNumber: 485,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx",
        lineNumber: 449,
        columnNumber: 5
    }, this);
}
_s1(SuperAdminSidebar, "g9gWD0n+TsOylydNL8LxU3SIxEM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$dashboard$2f$dashboard$2d$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$security$2f$page$2d$security$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSecurity"]
    ];
});
_c1 = SuperAdminSidebar;
var _c, _c1;
__turbopack_context__.k.register(_c, "SidebarItem");
__turbopack_context__.k.register(_c1, "SuperAdminSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SuperAdminLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/node_modules/.pnpm/next@16.0.1_@babel+core@7.2_048eab391ea2e03c70ee64ac0670005b/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$security$2f$skybersecutity$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/components/security/skybersecutity.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$dashboard$2f$dashboard$2d$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/components/dashboard/dashboard-theme-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$dashboard$2f$super$2d$admin$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/backup/skyber-full/frontend/components/dashboard/super-admin-sidebar.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
function SuperAdminLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$security$2f$skybersecutity$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SkyberSecutity"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$dashboard$2f$dashboard$2d$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardThemeProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen flex dashboard-container bg-background bg-[radial-gradient(ellipse_at_top_left,rgba(23,212,146,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.08),transparent_60%)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$components$2f$dashboard$2f$super$2d$admin$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SuperAdminSidebar"], {}, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/layout.tsx",
                        lineNumber: 13,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 ml-64",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$backup$2f$skyber$2d$full$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$2_048eab391ea2e03c70ee64ac0670005b$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "w-full px-4 sm:px-6 lg:px-8 py-8",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/layout.tsx",
                            lineNumber: 15,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/layout.tsx",
                        lineNumber: 14,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/layout.tsx",
                lineNumber: 12,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/layout.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/layout.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = SuperAdminLayout;
var _c;
__turbopack_context__.k.register(_c, "SuperAdminLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_backup_skyber-full_frontend_71311d63._.js.map