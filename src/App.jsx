import  { Outlet } from 'react-router-dom';
import Navbar from './Component/Navbar';

export default function App(){
  return (
    <>
    <Navbar/>
    <Outlet/>
    <h2>footer</h2>
      
      </>
  )
}