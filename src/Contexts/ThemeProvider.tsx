import { createContext, useContext, useEffect, useState, type CSSProperties, type Dispatch, type HTMLAttributes, type ReactNode, type SetStateAction } from "react"

type ThemeContextType = {
    theme: 'light' | 'dark',
    setTheme: Dispatch<SetStateAction<'light' | 'dark'>>,

    primaryColor: string,
    setPrimaryColor: Dispatch<SetStateAction<string>>,

    secondaryColor: string,
    setSecondaryColor: Dispatch<SetStateAction<string>>,

    primaryBackgroundColor: string, 
    setPrimaryBackgroundColor: Dispatch<SetStateAction<string>>,

    secondaryBackgroundColor: string, 
    setSecondaryBackgroundColor: Dispatch<SetStateAction<string>>
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light', setTheme: () => {},
    primaryColor: '', setPrimaryColor: () => {},
    secondaryColor: '', setSecondaryColor: () => {},
    primaryBackgroundColor: '', setPrimaryBackgroundColor: () => {},
    secondaryBackgroundColor: '', setSecondaryBackgroundColor: () => {}
})



type ThemeColors = {
    primaryColor: string,
    secondaryColor: string,
    primaryBackgroundColor: string,
    secondaryBackgroundColor: string
}

const themeColors: {
    light: ThemeColors,
    dark: ThemeColors
} = {
    light: {
        primaryColor: 'black',
        secondaryColor: 'rgb(50,50,50)',
        primaryBackgroundColor: 'white',
        secondaryBackgroundColor: 'rgb(220,220,220)'
    },
    dark: {
        primaryColor: 'white',
        secondaryColor: 'rgb(220,220,220)',
        primaryBackgroundColor: 'black',
        secondaryBackgroundColor: 'rgb(30,30,30)'
    }
}

export default function ThemeProvider ({children}: {children: React.ReactNode}): React.JSX.Element {
    
    const appTheme: 'light' | 'dark' = localStorage.getItem('theme') === 'light' ? 'light' : "dark"; 

    const [theme, setTheme] = useState<'light' | 'dark'>(appTheme);
    const [primaryColor, setPrimaryColor] = useState<string>(themeColors[appTheme]['primaryColor']);
    const [secondaryColor, setSecondaryColor] = useState<string>(themeColors[appTheme]['secondaryColor']);
    const [primaryBackgroundColor, setPrimaryBackgroundColor] = useState<string>(themeColors[appTheme]['primaryBackgroundColor']);
    const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState<string>(themeColors[appTheme]['secondaryBackgroundColor']);

    useEffect(() => {
        localStorage.setItem('theme', theme)
        setPrimaryColor(themeColors[theme]['primaryColor']);
        setSecondaryColor(themeColors[theme]['secondaryColor']);
        setPrimaryBackgroundColor(themeColors[theme]['primaryBackgroundColor']);
        setSecondaryBackgroundColor(themeColors[theme]['secondaryBackgroundColor']);
    }, [theme])

    const states = {
        theme, setTheme,
        primaryColor, setPrimaryColor,
        secondaryColor, setSecondaryColor,
        primaryBackgroundColor, setPrimaryBackgroundColor,
        secondaryBackgroundColor, setSecondaryBackgroundColor
    }

    return <ThemeContext.Provider value={states} >{children}</ThemeContext.Provider>
}


export function useTheme(): ThemeContextType{
    return useContext(ThemeContext);
}





type TextProps = HTMLAttributes<HTMLParagraphElement> & {
    children: ReactNode,
    className?: string,
    isPrimary?: boolean,
    invertTheme?: boolean
    style?: CSSProperties,
    color?: string
}

export function ThemeText({children, className='', isPrimary=true, invertTheme=false, style={}, color='', ...props}: TextProps): React.JSX.Element {

    const {primaryColor, secondaryColor, primaryBackgroundColor, secondaryBackgroundColor} = useTheme();

    if(!color) {
        if(invertTheme) {
            color = isPrimary ? primaryBackgroundColor : secondaryBackgroundColor;
        } else {
            color = isPrimary ? primaryColor : secondaryColor;
        }
    }

    return (
        <p className={className} {...props}
            style={{
                opacity: isPrimary ? 1 : 0.8,
                color, ...style
            }}
        >{children}</p>
    )
}



type ViewProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode
    className?: string,
    isPrimary?: boolean,
    invertTheme?: boolean,
    style?: CSSProperties,
    backgroundColor?: string
}

export function ThemeView({children, className='', isPrimary=true, invertTheme=false, style={}, backgroundColor='', ...props}: ViewProps): React.JSX.Element {

    const {primaryColor, secondaryColor, primaryBackgroundColor, secondaryBackgroundColor} = useTheme();
    let color;
    
    if(!backgroundColor) {
        if(invertTheme) {
            backgroundColor = isPrimary ? primaryColor : secondaryColor;
            color = isPrimary ? primaryBackgroundColor : secondaryBackgroundColor;
        } else {
            backgroundColor = isPrimary ? primaryBackgroundColor : secondaryBackgroundColor;
            color = isPrimary ? primaryColor : secondaryColor;
        }
    }


    return (
        <div className={className} {...props}
            style={{
                opacity: isPrimary ? 1 : 0.8,
                backgroundColor, color,
                ...style
            }}
        >{children}</div>
    )
}