import { useRef, useState, type RefObject} from "react"

type ReturnType<Type> = [
    Type,
    (val: Type) => void,
    RefObject<Type>
]

export default function useStateRef<Type>(val: Type): ReturnType<Type> {
    const [state, _setState] = useState<Type>(val);
    const stateRef = useRef<Type>(val);

    function setState(val: Type): void {
        _setState(val)
        stateRef.current = val;
    }

    return [state, setState, stateRef]
}