import { useEffect } from "react";

// Sets the browser tab title, e.g. "Menu | Turye".
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | Turye` : "Turye | Fresh food, delivered";
  }, [title]);
}
