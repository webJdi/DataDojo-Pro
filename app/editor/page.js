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

  // state variables for colour mode
  
  const [col1, setCol1] = useState('#191c35'); // Darker shade
  const [col2, setCol2] = useState('#E07A5F'); // red
  const [col3, setCol3] = useState('#81B29A'); // green
  const [col4, setCol4] = useState('#F4F1DE'); // white
  const [col5, setCol5] = useState('#F2CC8F'); // yellow
  const [col6, setCol6] = useState('#3D405B'); // Dark shade
  const [col7, setCol7] = useState('#5FA8D3'); //Blue
  const [col8, setCol8] = useState('#2b2d44'); //Darker shade

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

      // Add this section for colour modes
      const unsubs = onSnapshot(doc(db,"users",currentUser.email), (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData.mode) {
            setMode(userData.mode);
          }
          if(userData.mode == "light")
            {
                setCol1('#EDE8E2');
                setCol2('#E07A5F');
                setCol3('#81B29A');
                setCol4('#000');
                setCol5('#F2CC8F');
                setCol6('#F4F1ED');
                setCol7('#5FA8D3');
                setCol8('#FFF'); 
            }
            else
            {
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
      display={'flex'}
      bgcolor={col1}
      overflow={isMobile ? 'auto' : 'hidden'}
      flexDirection={isMobile ? 'column' : 'row'}
    >
      <Navbar />

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : "row"}
        gap={2}
        bgcolor={col1}
        width={isMobile ? "100vw" : "80vw"}
        height="92vh"
      >
        <Box flex={1} width={isMobile ? '95vw' : '30vw'} sx={{ p: 2 }}>
          <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: col6, color: col4 }}>
            <Typography variant="h6" gutterBottom>
              Problem Statement
            </Typography>
            <Box
              height={'20vh'}
              width={'100%'}
              overflow={'auto'}
              bgcolor={col6}
            >
              {questions.questions.map((question) => (
                <Box
                  key={question.id}
                  onClick={() => handleQuestionSelect(question)}
                  bgcolor={selectedQuestionId === question.id ? col3 : col1}
                  width={'100%'}
                  padding={'10px 0'}
                  color={col4}
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
            <Paper elevation={3} sx={{ p: 2, bgcolor: col6, color: col4 }}>
              <Typography variant="h6" gutterBottom>
                Test Cases for {selectedQuestion.shortTitle}
              </Typography>
              <Box height={'30vh'} overflow={'auto'}>
                <List>
                  {selectedQuestion.testCases.map((testCase, index) => (
                    <ListItem key={index} color={col4}>
                      <ListItemText primary={`Input: ${testCase.input}`} secondary={`Expected Output: ${testCase.expectedOutput}`}
                      sx={{ 
                        "& .MuiTypography-root": { // Targeting the secondary text
                          color: col3 // Your desired color
                        }
                      }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>
          )}
          <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: col6, color: col4}} marginTop={'2'}>
            <Typography variant="h6" sx={{ mt: 2 }} textAlign={'center'}>
              Score 
              <Typography variant="span" padding={'0.2em 0.8em'} 
              bgcolor={col3}
              color={col4} fontSize={'1.5em'} borderRadius={'0.5em'} margin={'0 0.2em'}>
                {score}
              </Typography>
            </Typography>
          </Paper>
        </Box>
          
        <Box width={isMobile ? '95vw' : '45vw'} flex={2} sx={{ p: 2 }}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: col6, color: col4  }}>
            <Tabs value={language} onChange={(event, newValue) => setLanguage(newValue)}>
              <Tab label="Python" sx={{ color: col4 }} />
              <Tab label="JavaScript" sx={{ color: col4 }} />
              <Tab label="C" sx={{ color: col4 }} />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              <Editor
                height="30vh"
                language={languages[language]} 
                value={code}
                theme={mode === 'light' ? 'light' : 'vs-dark'}
                onChange={(value) => setCode(value)}
                options={{
                  fontSize: 18,
                  fontFamily: 'monospace', 
                  lineHeight: 22, 
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained"
              sx={{ mt: 2, bgcolor: col3, color: col4 }} startIcon={<PlayArrowIcon />} onClick={handleRunCode}>
                Run Code
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom color={col4}>
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
