import Sidebar from './Components/Sidebar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Add from './Pages/Add'
import List from './Pages/List'
import Orders from './Pages/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Components/Navbar'
import AuthPage from './Pages/AuthPage'
import { useContext } from 'react'
import { GlobalContext } from './Context/GlobalContext'

const App = () => {
  const {isLoggedIn} = useContext(GlobalContext) as any
  console.log(isLoggedIn)
  return (
    <>
      <ToastContainer/>
      {isLoggedIn && <Navbar/>}
      <hr />
      <div className='app-content'>
       {isLoggedIn && <Sidebar/>}
        <Routes>
          {!isLoggedIn && <Route  path='/*' element={<Navigate to="/login"/>}></Route>}
          {!isLoggedIn && <Route index  path='/login' element={<AuthPage/>}></Route>}
          {isLoggedIn && <Route  path='/*' element={<Navigate to="/add"/>}></Route>}
          {isLoggedIn && <Route  index path="/add" element={<Add/>}/>}
          {isLoggedIn && <Route path="/list" element={<List/>}/>}
          {isLoggedIn && <Route path="/orders" element={<Orders/>}/>}
        </Routes>
      </div>
    </>
  )
}

export default App
