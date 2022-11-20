import { useEffect, useRef } from "react";

// to use this hook, declare a wrapper ref: const wrapperRef = useRef(null);
// then use the hook: useOutsideAlerter(wrapperRef);
export const useOutsideAlerter = (ref) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      // if (ref.current && !ref.current.contains(event.target)) {
      // }
    }
    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
};
