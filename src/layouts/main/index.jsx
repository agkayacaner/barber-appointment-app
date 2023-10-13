import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <main className='max-w-7xl px-5 lg:mx-auto h-screen p-5'>
      <Outlet />
    </main>
  );
}
