import { createBrowserRouter } from 'react-router-dom';
// Layouts
import MainLayout from '~/layouts/main';
// Pages
import Create from '~/pages/create';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [{ index: true, element: <Create /> }],
  },
]);

export default routes;
