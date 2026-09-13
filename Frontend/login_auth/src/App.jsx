import Signup from './LoginForm/Signup';
import Login from './LoginForm/Login'
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Groups from './Pages/Groups'
import Friends from './Pages/Friends'
import Dashboard from './Pages/Dashboard'
import Home from './Pages/Home'
import Group from './Pages/Group'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/register' element={<Signup/>}/>
        <Route path='/Login' element={<Login/>}/>

        <Route path='/home' element={
          <Home/>
         }/>
        <Route path='/dashboard' element={
          <Dashboard/>
        }/>
        <Route path='/Groups' element={
          <Groups/>
        }/>
        <Route path='/Friends' element={
          <Friends/>
        }/>
        <Route path='/Group' element={
          <Group/>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
