import { createRoot } from 'react-dom/client'
import { BrowserRouter , Routes , Route} from 'react-router-dom';


import App from './App';

import UserLogin from './App/UserLogin';
import UserSignup from './App/UserSignup';
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
<BrowserRouter>
    <Routes>
      {/* initial route  */}
     
      <Route path='/' element={<UserSignup/>}/>
      
      <Route path='/login' element={<UserLogin/>}/>
      <Route path='/App' element={<App/>}>
      </Route>
    </Routes>
  </BrowserRouter>
)