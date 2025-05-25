import React from 'react'
import bgImage from './assets/background.jpg'
import GetcurrentLocation from './components/GetcurrentLocation'

const App = () => {
  return (
    <div className='min-h-screen bg-cover bg-center flex flex-col justify-center items-center' style={{backgroundImage: `url(${bgImage})`}}>
      <GetcurrentLocation/>
      <div className='text-white font-semibold uppercase py-4'>
        Developed by Samyak Borkar | SamyakBorkar
      </div>
      
    </div>
  )
} 

export default App