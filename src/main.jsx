import { createRoot } from 'react-dom/client'
import { BrowserRouter , Routes , Route} from 'react-router-dom';

import App from './App';

import UserLogin from './App/UserLogin';
import UserSignup from './App/UserSignup';
import Footer from './Component/Footer/Footer';
import Header from './Component/Header/Header';
import Layout from './Component/Layout/Layout';
import Home from './Home/Home';
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
<BrowserRouter>
    <Routes>
      {/* initial route  */}
      <Route path='' element={<UserSignup/>}/>
      <Route path='/register' element={<UserSignup/>}/>
      <Route path='/footer' element={<Footer/>}/>
      <Route path='/header' element={<Header/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/layout' element={<Layout/>}/>
      <Route path='/login' element={<UserLogin/>}/>
      <Route path='/app' element={<App/>}>
      </Route>
    </Routes>
  </BrowserRouter>
)