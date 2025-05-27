import React from 'react';
import GetcurrentLocation from './components/GetcurrentLocation';
import styles from './App.module.css';

const App = () => {
  return (
    <div className={styles.container}>
      <GetcurrentLocation/>
<div className="text-white font-semibold py-2 px-4 rounded-full
               bg-[rgba(53,92,125,0.6)] backdrop-blur-sm
               border border-white/10">
  Developed by Samyak Borkar | SamyakBorkar
</div>
    </div>
  );
}

export default App;