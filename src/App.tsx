import { useState, useEffect } from 'react'


export default function App() {

  const [message,setMessage] = useState('');

  useEffect(()=>{
    (async ()=>{
      const response = await fetch('/api/hello');
      const data = await response.json();
      setMessage((data as any).message);
    })();
  }, []);

  return <>
    <h1>A message from our backend</h1>
    <p>{message}</p>
  </>

}