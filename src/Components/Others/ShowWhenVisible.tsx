import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import useVisibilityObserver from "../../Hooks/useVisibilityObserver";

type Props = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode,
    rootMargin?: string
}

export default function ShowWhenVisible({children, rootMargin='0px', ...props}: Props): React.JSX.Element {

    const {ref, visibleRef} = useVisibilityObserver(rootMargin);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if(!ref.current) return;

        if(visibleRef.current === false) {
            const {height} = ref.current.getBoundingClientRect();
            ref.current.style.minHeight = height + 'px';
            ref.current.style.height = height + 'px';
        } else {
            ref.current.style.minHeight = 'auto';
            ref.current.style.height = 'auto';
        }
  
        setVisible(visibleRef.current);
    }, [visibleRef.current])

    return (
        <div ref={ref} {...props} >
            {visible ? children : null}
        </div>
    )
} 