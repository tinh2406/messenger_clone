import { DependencyList, RefObject, useEffect } from "react";

export default function useOnScreen(
  ref: RefObject<HTMLElement>,
  handler?: () => void,
  deps?:DependencyList,
) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Thực hiện hành động khi phần tử xuất hiện
          // console.log("Phần tử đã xuất hiện!",ref.current?.textContent);
          if (handler) handler();
        }
      });
    });

    // Bắt đầu quan sát khi thành phần được mount
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Ngừng quan sát khi thành phần bị unmount
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, deps);
}
