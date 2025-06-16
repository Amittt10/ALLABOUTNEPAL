import { createRoot } from 'react-dom/client'
import { BrowserRouter , Routes , Route} from 'react-router-dom';



import UserSignup from './Component/UserSignup/UserSignup';
import UserLogin from './Component/UserLogin/UserLogin';  
import Header from './Component/Header/Header';
import Home from './Home/Home';
import Footer from './Component/Footer/Footer';
import Layout from './Component/Layout/Layout';
import App from '../../src/App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
<BrowserRouter>
    <Routes>
      {/* initial route  */}
      <Route path='/register' element={<UserSignup/>}/>
      <Route path='/footer' element={<Footer/>}/>
      <Route path='/header' element={<Header/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/layout' element={<Layout/>}/>
      <Route path='/login' element={<UserLogin/>}/>
      <Route path='' element={<App/>}>
      </Route>
    </Routes>
  </BrowserRouter>
)