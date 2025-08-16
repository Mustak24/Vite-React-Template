import './App.css'
import StarsBackground from './Components/BackgroundViews/StarsBackground'
import ThemeProvider, { ThemeView } from './Contexts/ThemeProvider'

function App() {

  return (
    <ThemeProvider>
      <ThemeView className='w-full h-full flex items-center justify-center text-5xl font-bold' >
        <StarsBackground className={'fixed w-screen h-screen top-0 left-0'} />
        <div className='w-full h-full flex items-center justify-center text-5xl font-bold' >Hello World</div>
      </ThemeView>
    </ThemeProvider>
  )
}

export default App
