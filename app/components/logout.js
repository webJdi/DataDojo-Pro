import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const useLogout = (router) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      router.push('/signin');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return handleLogout;
};

export default useLogout;