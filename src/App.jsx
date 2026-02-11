import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SkillGapDiagnosisTool from './component/SkillGapDiagnosisTool'
import Header from './component/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
      <SkillGapDiagnosisTool />
    </>
  )
}

export default App
