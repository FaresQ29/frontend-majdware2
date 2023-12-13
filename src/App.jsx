import { useState } from 'react'
import {Route, Routes} from 'react-router-dom';
import MainAuth from './Components/Auth/MainAuth'
import Main from './Components/Main/Main';
import { UserProviderWrapper } from './context/user.context';
import {IsPrivate, IsAnon} from './Components/PageVisibility';

function App() {


  return (
    <>
    <UserProviderWrapper>
      <Routes>
          <Route path="/" element={ <IsAnon><MainAuth /></IsAnon>  } />
          <Route path="/main" element={<IsPrivate> <Main /> </IsPrivate> } />
        </Routes>  
    </UserProviderWrapper>

    </>
  )
}

export default App
