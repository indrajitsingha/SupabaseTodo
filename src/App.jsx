import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Page from './Curd'

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from './utils/supabase';
import { BrowserRouter, Route, Routes } from 'react-router-dom'


import Navbar from './components/Navbar'
import { Addbrand } from './Addbrand'
import Addcar from './Addcar'
import { Ctaegory } from './Ctaegory'

function App() {
  const [count, setCount] = useState(0)
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google", "facebook", "github"]}
          />
        </div>

      </div>
    );
  } else {
    return (
      <div style={{ width: "100%" }}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navbar />} >
            <Route index element={<Page />} />
            <Route path='/Addbrand' element={<Addbrand />} />
            <Route path='/Addcar' element={<Addcar />} />
            <Route path='/Ctaegory' element={<Ctaegory />} />
            </Route>
          </Routes>
        </BrowserRouter>
        {/* <Page /> */}
        <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    );
  }

  // return (
  //   <>
  //     <Page />
  //     {/* <div>
  //       <a href="https://vitejs.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p> */}
  //   </>
  // )
}

export default App
