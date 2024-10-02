'use client';

import { Paper, Typography, Tabs, Tab, Button, TextField, List, ListItem, ListItemText, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase';
import questions from './questions.json'; // Direct import from JSON
import useLogout from '../components/logout';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useMediaQuery from '@mui/material/useMediaQuery';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Navbar from '../components/navbar';

export default function ProblemSolver() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [mode, setMode] = useState('dark');
  const [language, setLanguage] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [score, setScore] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const handleLogout = useLogout();
  const auth = getAuth();
  const [user, setUser] = useState('');

  const isMobile = useMediaQuery('(max-width:450px)');
  const languages = ['python', 'javascript', 'c'];

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

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setSelectedQuestionId(question.id);
    setCode('');
    setOutput('');
  };

  const handleRunCode = async () => {
    try {
      // Prepare the payload directly with code and test cases
      const payload = {
        code: code,
        testCases: selectedQuestion.testCases,
      };

      const response = await fetch('/api/editor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the payload directly
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break; 
        }
        result += decoder.decode(value, { stream: true });
      }

      setOutput(result);

      // Check the output for success message
      const found = result.includes("You score! +1");
      if (found) {
        setScore((prevScore) => prevScore + 10);
        if (user.email) {
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
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      overflow={isMobile ? 'auto' : 'hidden'}
      flexDirection={isMobile ? 'column' : 'row'}
    >
      <Navbar />

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : "row"}
        gap={2}
        width={isMobile ? "100vw" : "80vw"}
        height="92vh"
      >
        <Box flex={1} width={isMobile ? '95vw' : '30vw'} sx={{ p: 2 }}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Problem Statement
            </Typography>
            <Box height={'20vh'} width={'100%'} overflow={'auto'}>
              {questions.questions.map((question) => (
                <Box
                  key={question.id}
                  onClick={() => handleQuestionSelect(question)}
                  bgcolor={selectedQuestionId === question.id ? '#81B29A' : '#F4F1DE'}
                  width={'100%'}
                  padding={'10px 0'}
                  borderBottom={"1px solid #E07A5F"}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#F2CC8F',
                    },
                  }}
                >
                  <Typography marginLeft={'1em'}>{question.problemStatement}</Typography>
                  <Typography marginRight={'1em'}>{question.difficulty}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
          {selectedQuestion && (
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Test Cases for {selectedQuestion.shortTitle}
              </Typography>
              <Box height={'30vh'} overflow={'auto'}>
                <List>
                  {selectedQuestion.testCases.map((testCase, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`Input: ${testCase.input}`} secondary={`Expected Output: ${testCase.expectedOutput}`} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>
          )}
          <Paper elevation={3} sx={{ p: 2, mb: 2 }} marginTop={'2'}>
            <Typography variant="h6" sx={{ mt: 2 }} textAlign={'center'}>
              Score 
              <Typography variant="span" padding={'0.2em 0.8em'} bgcolor={'#81B29A'} fontSize={'1.5em'} borderRadius={'0.5em'} margin={'0 0.2em'}>
                {score}
              </Typography>
            </Typography>
          </Paper>
        </Box>
          
        <Box width={isMobile ? '95vw' : '45vw'} flex={2} sx={{ p: 2 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Tabs value={language} onChange={(event, newValue) => setLanguage(newValue)}>
              <Tab label="Python" />
              <Tab label="JavaScript" />
              <Tab label="C" />
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
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={handleRunCode}>
                Run Code
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Output
              </Typography>
              <TextField 
                fullWidth 
                multiline 
                rows={6} 
                variant="outlined" 
                value={output} 
                InputProps={{ readOnly: true }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
