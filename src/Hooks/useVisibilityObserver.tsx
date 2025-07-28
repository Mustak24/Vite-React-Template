import { useEffect, useRef, type RefObject } from "react";
import useStateRef from "./useStateRef";

type ReturnType = {
  ref: RefObject<HTMLDivElement | null>;
  visible: boolean;
  visibleRef: RefObject<boolean>
};

export default function useVisibilityObserver(rootMargin="0px"): ReturnType {

  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible, visibleRef] = useStateRef<boolean>(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isNowVisible = entry.isIntersecting;
        setVisible(isNowVisible)
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [rootMargin, ref]);

  return { ref, visible, visibleRef };
}
