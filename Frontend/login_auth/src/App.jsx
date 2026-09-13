import Signup from './LoginForm/Signup';
import Login from './LoginForm/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Groups from './Pages/ModernGroups'
import Friends from './Pages/ModernFriends'
import Dashboard from './Pages/Dashboard'
import Home from './Pages/ModernHome'
import ModernGroup from './Pages/ModernGroup'
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
          <ModernGroup/>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
