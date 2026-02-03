import { create } from "zustand";
export const useThemeStore= create((set)=>({
    theme:localStorage.getItem("preferred-theme") || "forest",
    setTheme: (theme)=>{
        localStorage.setItem("preferred-theme", theme);
        set({theme});
    }
}))





// import { create } from "zustand";
// export const useThemeStore= create((set)=>({
//     theme: typeof window != "undefined"
//      ? localStorage.getItem("preferred-theme") || "forest" : "forest",
//     setTheme: (theme)=>{
//         localStorage.setItem("preferred-theme", theme);
//         set({theme});
//     }
// }))