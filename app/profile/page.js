'use client'

import {
  Box,
  Typography,
  IconButton,
  Stack,
  Link,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Alert,
  AlertTitle,
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BookIcon from "@mui/icons-material/Book";
import BoltIcon from '@mui/icons-material/Bolt';
import useMediaQuery from '@mui/material/useMediaQuery';

import { auth, db } from "../firebase";
import { collection, query, where, getDocs, doc, onSnapshot } from "firebase/firestore";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Image from "next/image";

export default function Profile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [yourScore, setYourScore] = useState("");
  const [highestScore, setHighestScore] = useState("");
  const [recentActivity, setRecentActivity] = useState([]);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // New state variable for the error message

  const isMobile = useMediaQuery('(max-width:450px)');

  // state variables for colour mode
  const [mode, setMode] = useState('dark');
  const [col1, setCol1] = useState('#191c35'); // Darker shade
  const [col2, setCol2] = useState('#E07A5F'); // red
  const [col3, setCol3] = useState('#81B29A'); // green
  const [col4, setCol4] = useState('#F4F1DE'); // white
  const [col5, setCol5] = useState('#F2CC8F'); // yellow
  const [col6, setCol6] = useState('#3D405B'); // Dark shade
  const [col7, setCol7] = useState('#5FA8D3'); //Blue
  const [col8, setCol8] = useState('#2b2d44'); //Darker shade

  const getMaxScore = async () => {
    try {
      const userRef = collection(db, "users");
      const querySnapshot = await getDocs(userRef);

      if (!querySnapshot.empty) {
        let maxScore = 0;
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const userScore = userData.score;
          if (userScore > maxScore) {
            maxScore = userScore;
          }
        });
        setHighestScore(maxScore);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getNameByEmail = async (email) => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setName(userData.name);
        setYourScore(userData.score);
      } else {
        console.log("No user found with this email.");
        setAuthError("User data not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAuthError(error.message);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setPasswordError(true);
      return;
    }
  
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
  
    try {
      await reauthenticateWithCredential(user, credential);
      console.log("Reauthentication successful");
    } catch (error) {
  
      if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Incorrect old password.');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('Too many failed login attempts. Please reset your password or try again later.');
      } else {
        setErrorMessage('An error occurred during reauthentication. Please try again.');
      }
      
      setPasswordError(true); 
      return; 
    }
  
    try {
      // Update the password after successful reauthentication
      await updatePassword(user, newPassword);
      console.log("Password updated successfully");
  
      // Clear state and indicate success
      setPasswordChangeSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setErrorMessage(""); // Clear any previous errors
      setPasswordError(false); // Remove error state if any
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage('Failed to update the password. Please try again.');
      setPasswordError(true);
    }
  };
     

  useEffect(() => {
    getMaxScore();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoading(false);
        setEmail(user.email);
        getNameByEmail(user.email);

        // Add this section for colour modes
        const unsubs = onSnapshot(doc(db, "users", user.email), (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            if (userData.mode) {
              setMode(userData.mode);
            }
            if (userData.mode == "light") {
              setCol1('#EDE8E2');
              setCol2('#E07A5F');
              setCol3('#81B29A');
              setCol4('#000');
              setCol5('#F2CC8F');
              setCol6('#F4F1ED');
              setCol7('#5FA8D3');
              setCol8('#FFF');
            } else {
              setCol1('#191c35');
              setCol2('#E07A5F');
              setCol3('#81B29A');
              setCol4('#F4F1DE');
              setCol5('#F2CC8F');
              setCol6('#3D405B');
              setCol7('#5FA8D3');
              setCol8('#2b2d44');
            }
          }
        });
        return () => {
          unsubs();
        };
        // Colour modes' section ends here
      } else {
        router.push("/signin");
      }
    }, (error) => {
      setAuthError(error.message);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  if (isLoading) {
    return (
      <Box
        bgcolor={col1}
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h4" color={col4}>Loading...</Typography>
      </Box>
    );
  }

  if (authError) {
    return (
      <Box
        bgcolor={col1}
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h4" color={col4}>Error: {authError}</Typography>
      </Box>
    );
  }

  return (
    <Box
      width={'100vw'}
      minHeight={'100vh'}
      backgroundColor={col1}
      display={'flex'}
      overflow={'hidden'}
      flexDirection={isMobile?'column':'row'}
    >
      <Navbar mode={mode} setMode={setMode} />

      <Box
        width={isMobile?'100vw':'80vw'}
        height={'100vh'}
        bgcolor={col1}
        display={'flex'}
        flexDirection={'column'}
      >
        <Box
          width={isMobile?'96vw':'76vw'}
          margin={'4vh 2vw 2vh 2vw'}
          borderRadius={'0.2em'}
          color={col4}
          padding={'1em'}
          display={'flex'}
          flexDirection={'column'}
        >
          <Box p={2}>
            <IconButton onClick={() => router.back()} sx={{ color: col1 }}>
              <ArrowBackIcon />
            </IconButton>
          </Box>

          <Stack sx={{ px: 4, pb: 4,  flexGrow: 1 }}>
            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: 'bold', color: col4 }}
            >
              {name}'s Profile
            </Typography>

            <Typography
              variant="h6"
              align="center"
              sx={{ color: col3 }}
            >
              {email}
            </Typography>
            
            <Typography variant="h5" sx={{ color: col1, fontWeight: 'bold', mt: 3 }}>
              Your Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ backgroundColor: col2, p: 2, borderRadius: '10px' }}>
                  <CardActionArea>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <StarIcon sx={{ color: col4 }} />
                        <Typography variant="h6" sx={{ color: col4 }}>
                          Core Score: {yourScore}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ backgroundColor: col2, p: 2, borderRadius: '10px' }}>
                  <CardActionArea>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmojiEventsIcon sx={{ color: col4 }} />
                        <Typography variant="h6" sx={{ color: col4 }}>
                          High Score: {highestScore}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h5" sx={{ color: col1, fontWeight: 'bold', mt: 3 }}>
              Change Password
            </Typography>
            <TextField
              label="Old Password"
              variant="outlined"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2, '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: col4,
                },
                '&:hover fieldset': {
                  borderColor: col4,
                },
                '&.Mui-focused fieldset': {
                  borderColor: col4,
                },
              }, '& .MuiInputLabel-root': {
                color: col4,
              }, '& .MuiOutlinedInput-input': {
                color: col4,
              }, }}
            />
            <TextField
              label="New Password"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2, '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: col4,
                },
                '&:hover fieldset': {
                  borderColor: col4,
                },
                '&.Mui-focused fieldset': {
                  borderColor: col4,
                },
              }, '& .MuiInputLabel-root': {
                color: col4,
              }, '& .MuiOutlinedInput-input': {
                color: col4,
              }, }}
            />
            <Button variant="contained" color="primary" onClick={handlePasswordChange} sx={{ backgroundColor: col5 }}>
              Update Password
            </Button>

            <Collapse in={passwordError}> 
                <Alert severity="error" sx={{ mt: 2 }}>
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage} {/* Render the error message */}
                </Alert>
            </Collapse>

            <Collapse in={passwordChangeSuccess}> 
                <Alert severity="success" sx={{ mt: 2 }}>
                    <AlertTitle>Success</AlertTitle>
                    Password changed successfully!
                </Alert>
            </Collapse>


          </Stack>
        </Box>
      </Box>
    </Box>
  );
}