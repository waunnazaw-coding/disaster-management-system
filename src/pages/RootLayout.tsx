import { TriangleAlert } from 'lucide-react';
import Public from '../components/layout/public';
import Navbar from '../components/layout/Navbar';
import { RouterProvider } from 'react-router-dom';
import { router } from '../routes';
import { Toaster } from 'sonner';

const RootLayout = () => {
  return(
<>
 
   <RouterProvider router={router} />
   <Toaster richColors position="top-right" />
  </>
  )
  
};

export default RootLayout;
