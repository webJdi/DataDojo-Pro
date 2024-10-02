'use client';

import { Paper, Typography, Tabs, Tab, Button, TextField, List, ListItem, ListItemText, Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ref, push, set } from 'firebase/database';
import { db } from '../../firebase';
import questions from '../questions.json'; // Direct import from JSON
import Editor from '@monaco-editor/react';
import useLogout from '../../components/logout';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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

  const col6 = '#3D405B'; // Dark shade
  const col2 = '#E07A5F'; // Red
  const col3 = '#81B29A'; // Green
  const col4 = '#F4F1DE'; // White
  const col5 = '#F2CC8F'; // Yellow
  const col1 = '#191c35'; // Darker shade

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
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.email) {
      getScore(user.email); 
    }
  }, [user]);

  return (
    <Box width="100vw" height="100vh" bgcolor={col1}>
      <Box
        width='92vw'
        height='8vh'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        padding={'0 4vw'}
      >
        <Typography color={col4} margin='0.5em' fontSize='2em'>
          <Link color='inherit' underline='none' href='../'>Learn Buddy</Link>
        </Typography>

        <Box display={'flex'} justifyContent={'space-around'} width={'30vw'}>
          <Button
            href='../dashboard/'
            sx={{
              color: col4,
              borderBottom: `4px solid ${col4}`,
              '&:hover': {
                color: col1,
                backgroundColor: col4,
              }
            }}
          >
            <HomeIcon display={'block'} />
          </Button>
          <Button
            href='../editor/'
            sx={{
              color: col2,
              borderBottom: `4px solid ${col2}`,
              '&:hover': {
                color: col1,
                backgroundColor: col2,
              }
            }}
          >
            <CodeIcon />
          </Button>
          <Button
            href='../chat/'
            sx={{
              color: col3,
              borderBottom: `4px solid ${col3}`,
              '&:hover': {
                color: col1,
                backgroundColor: col3,
              }
            }}
          >
            <SupportAgentIcon />
          </Button>
          <Button
            href='../fcgen/'
            sx={{
              color: col5,
              borderBottom: `4px solid ${col5}`,
              '&:hover': {
                color: col1,
                backgroundColor: col5,
              }
            }}
          >
            <BoltIcon />
          </Button>
        </Box>

        <Box>
          <Button
            href="../profile/"
            onClick={handleLogout}
            sx={{
              color: col4,
              '&:hover': {
                color: col1,
                backgroundColor: col4,
              }
            }}
          >
            <LogoutIcon />
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="row" bgcolor={col1} gap={2} width="100vw" height="92vh">
        <Box flex={1} sx={{ p: 2 }}>
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
                language={languages[language]} 
                value={code}
                theme="vs-dark"
                onChange={(value) => setCode(value)}
                options={{
                  fontSize: 18,
                  fontFamily: 'monospace', 
                  lineHeight: 22, 
                }}
              />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={handleRunCode}
                sx={{ backgroundColor: col3, '&:hover': { backgroundColor: col5 } }}
              >
                Run Code
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setOutput('');
                  setCode(''); // Clear the code editor when resetting
                }}
                sx={{ backgroundColor: col2, '&:hover': { backgroundColor: col4 } }}
              >
                Reset
              </Button>
            </Box>
            <Paper elevation={3} sx={{ p: 2, mt: 2, bgcolor: col6, color: col4 }}>
              <Typography variant="h6" gutterBottom>
                Output
              </Typography>
              <Typography variant="body1" color={col3}>
                {output}
              </Typography>
            </Paper>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
