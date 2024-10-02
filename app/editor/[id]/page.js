'use client';

import { Paper, Typography, Tabs, Tab, Button, TextField, List, ListItem, ListItemText, Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ref, push, set } from 'firebase/database';
import { db } from '../../firebase';
import questions from '../questions.json'; // Direct import from JSON
import Editor from '@monaco-editor/react';
import useLogout from '../../components/logout';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useMediaQuery from '@mui/material/useMediaQuery';

//Components
import Navbar from '../../components/navbar';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useEffect } from 'react';

export default function ProblemSolver({ params }) {
  const { id } = params;

  // For Handling undefined or non-integer id gracefully
  const question = questions.questions.find(q => q.id === parseInt(id)) || null;

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

  const [language, setLanguage] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const handleLogout = useLogout();
  const languages = ['python', 'javascript', 'c'];
  const auth = getAuth();

  const handleLanguageChange = (event, newValue) => {
    setLanguage(newValue);
  };

  const getScore = async (email) => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email)); 
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setScore(userData.score); 
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRunCode = async () => {
    try {
      const messages = [
        {
          role: "system",
          content: "You are a code execution engine that runs code and validates it against test cases.",
        },
        {
          role: "user",
          content: `Here is the code:\n${code}\nTest cases:\n${JSON.stringify(question.testCases)}`,
        },
      ];

      const response = await fetch('/api/editor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // Get the JSON data directly
      setOutput(data.output || ''); // Update output based on the response

      // Check for scoring
      if (data.scoreIncremented) {
        setScore(prevScore => prevScore + 10);
        if (user?.email) {
          const userRef = doc(db, 'users', user.email);
          await updateDoc(userRef, {
            score: score + 10,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // Add this section for colour modes
      const unsubs = onSnapshot(doc(db,"users",currentUser.email), (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData.mode) {
            setMode(userData.mode);
          }
          if(userData.mode == "light") {
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
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.email) {
      getScore(user.email); 
    }
  }, [user]);

  return (
    <Box
      width="100vw"
      height="100vh"
      bgcolor={col1}
      display={'flex'}
      overflow={isMobile ? 'auto' : 'hidden'}
      flexDirection={isMobile ? 'column' : 'row'}
    >
      <Navbar/>

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : "row"}
        bgcolor={col1}
        gap={2}
        width={isMobile ? "100vw" : "80vw"}
        height="92vh">
        
        <Box
          flex={1}
          width={isMobile ? '95vw' : '30vw'}
          sx={{ p: 2 }}>
          <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: col6, color: col4 }}>
            <Typography variant="h6" gutterBottom>
              Problem Statement
            </Typography>
            <Typography variant="body1">{question?.problemStatement}</Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, bgcolor: col6, color: col4 }}>
            <Typography variant="h6" gutterBottom>
              Test Cases
            </Typography>
            <List>
              {question?.testCases.map((testCase, index) => (
                <ListItem key={index} color={col4}>
                  <ListItemText 
                    primary={`Input: ${testCase.input}`} 
                    secondary={`Expected Output: ${testCase.expectedOutput}`} 
                    sx={{ 
                      "& .MuiTypography-root": { // Targeting the secondary text
                        color: col3 // Your desired color
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: col6, color: col4 }} marginTop={'2'}>
            <Typography variant="h6" sx={{ mt: 2 }} textAlign={'center'}>
              Score 
              <Typography
                variant="span"
                padding={'0.2em 0.8em'}
                bgcolor={col3}
                color={col4}
                fontSize={'1.5em'}
                borderRadius={'0.5em'}
                margin={'0 0.2em'}
              >
                {score}
              </Typography>
            </Typography>
          </Paper>
        </Box>

        <Box flex={2} sx={{ p: 2, bgcolor: col1 }}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: col6, color: col4 }}>
            <Tabs value={language} onChange={handleLanguageChange} sx={{ color: col4 }}>
              <Tab label="Python" sx={{ color: col4 }} />
              <Tab label="JavaScript" sx={{ color: col4 }} />
              <Tab label="C" sx={{ color: col4 }} />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              <Editor
                height="30vh"
                language={languages[language]} // Adjusted for correct language usage
                theme={mode === 'light' ? 'light' : 'vs-dark'}
                value={code}
                onChange={setCode}
                options={{
                  selectOnLineNumbers: true,
                  automaticLayout: true,
                }}
              />
              <Button
                variant="contained"
                sx={{ mt: 2, bgcolor: col3, color: col4 }}
                startIcon={<PlayArrowIcon />}
                onClick={handleRunCode}
              >
                Run Code
              </Button>
              <Typography variant="h6" sx={{ mt: 2 }} color={col4}>
                Output
              </Typography>
              <Paper sx={{ bgcolor: col8, p: 2, height: '30vh', overflow: 'auto' }}>
                <Typography variant="body1" color={col4}>
                  {output}
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
