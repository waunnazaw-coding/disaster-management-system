// RootLayout.tsx
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RouterProvider } from "react-router-dom";
import router from "../routes/routes";

const GOOGLE_CLIENT_ID = "412277597098-bkuavvhll6m7u9j4sj6oha2js64ne02d.apps.googleusercontent.com";

const RootLayout = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
};

export default RootLayout;
