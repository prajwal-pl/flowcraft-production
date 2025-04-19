import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    // Set initial value
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add event listener for window resize
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Return false as a default during SSR, before the effect runs
  return isMobile !== undefined ? isMobile : false;
}
