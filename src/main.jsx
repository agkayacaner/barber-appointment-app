import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '~/assets/css/tailwind.css';
import routes from './routes';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={routes} />
    <Toaster position='bottom-center' />
  </>
);
