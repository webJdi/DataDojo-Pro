'use client'

import { Container,Link, Typography, Card, Box,Grid, Paper, TextField, Button, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";


// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';
import { CircularProgress } from "@mui/material";
import MoodIcon from '@mui/icons-material/Mood';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import WhatshotIcon from '@mui/icons-material/Whatshot';

//Components
import Navbar from '../components/navbar';
import QuestionCard from '../components/QuestionCard';
import ResultDialog from '../components/ResultDialog';

import {auth, db} from '../firebase';
import {collection, query, where, getDocs, doc, updateDoc,arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useLogout from '../components/logout';





export default function Home(){

    // Redirect section
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const handleLogout = useLogout();

    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [email, setEmail] = useState('');
    const [score, setScore] = useState(0);

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
    
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, count: 10 }),
            });
            const data = await response.json();
            setQuestions(data);
            setCurrentQuestionIndex(0);
            setUserAnswers({});
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
        setIsLoading(false);
    };

    const handleAnswer = (answer) => {
        setUserAnswers({ ...userAnswers, [currentQuestionIndex]: answer });
    };

    const handleNavigation = (direction) => {
        if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (direction === 'prev' && currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = () => {
        let correctAnswers = 0;
        questions.forEach((question, index) => {
            if (userAnswers[index] === question.Answer) {
                correctAnswers++;
            }
        });
        setScore(correctAnswers);
        const userRef = doc(db, 'users', email);
        updateDoc(userRef, {
          score: score + correctAnswers,
        })
        setShowResults(true);
        setTimeout(() => {
            router.push('/dashboard');
        }, 5000);
        
    };

    useEffect(() => {
        console.log("Component mounted, starting auth check");
        const timeoutId = setTimeout(() => {
            if (isLoading) {
                console.log("Auth check timed out");
                setAuthError("Authentication check timed out");
                setIsLoading(false);
            }
        }, 12000000); // 20 minute timeout

        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("Auth state changed:", user ? "User logged in" : "User not logged in");
            if (user) {
                console.log("User authenticated, setting loading to false");
                setIsLoading(false);
                setEmail(user.email);
                // Add this section for colour modes
                const unsubs = onSnapshot(doc(db,"users",user.email), (doc) => {
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



            } else {
                console.log("User not authenticated, redirecting to signin");
                router.push('/signin');
            }
        }, (error) => {
            console.error("Auth error:", error);
            setAuthError(error.message);
            setIsLoading(false);
        });

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    }, [router]);

    if (isLoading) {
        return (
            <Box
                bgcolor={col1}
                width={'100vw'}
                height={'100vh'}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <CircularProgress
                    height={'10'}
                    borderRadius={'10'}
                    color="success"
                ></CircularProgress>
            </Box>
        ); 
    }

    if (authError) {
        return (
            <Box
                bgcolor={col4}
                width={'100vw'}
                height={'100vh'}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h4">Error: {authError}</Typography>
            </Box>
        );
    }



return(
<Box
            width={'100vw'}
            minHeight={'100vh'}
            backgroundColor={col1}
            display={'flex'}
            overflow={'hidden'}
            >
                    <Navbar />

                    <Box
                        width={'80vw'}
                        height={'100vh'}
                        bgcolor={col1}
                        display={'flex'}
                        flexDirection={'column'}
                    >
                        <Box
                            width={'76vw'}
                            height={'25vh'}
                            margin={'4vh 2vw 2vh 2vw'}
                            
                            borderRadius={'0.2em'}
                            color={col4}
                            padding={'1em'}
                            display={'flex'}
                            flexDirection={'column'}
                        >
                            <Typography
                                variant="h4"
                                marginBottom={'0.4em'}
                            >
                                Quiz
                            </Typography>
                            <Box
                                width={'100%'}
                                display={'flex'}
                                flexDirection={'row'}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <Box
                                    width={'85%'}
                                >
                                    <TextField
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        label="Enter a topic name"
                                        fullWidth

                                        borderColor={'#fff'}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                              '& fieldset': {
                                                borderColor: col4,
                                              },
                                              '&:hover fieldset': {
                                                borderColor: col4,
                                              },
                                              '&.Mui-focused fieldset': {
                                                borderColor: col4,
                                              },
                                            },
                                            '& .MuiInputLabel-root': {
                                              color: col4,
                                            },
                                            '& .MuiOutlinedInput-input': {
                                              color: col4,
                                            },
                                          }}
                                    />
                                </Box>
                                <Box
                                    width={'15%'}
                                    padding={'0.5em'}
                                >
                                    <Button
                                        variant='contained'
                                        sx={{
                                            bgcolor:col5,
                                            color:'#444',
                                            borderRadius:'2em',
                                            padding:'0.8em 2em',
                                            '&:hover':{
                                                background:col4,
                                                color:col6
                                            }
                                        }}
                                        onClick={handleSubmit}
                                    >
                                        Generate 
                                        <DynamicFormIcon />
                                    </Button>
                                </Box>
                            </Box>
                            
                        </Box>
                        <Box
                            width={'76vw'}
                            height={'75vh'}
                            margin={'0 2vw 4vh 2vw'}
                            
                            padding={'1em'}
                        >
                            {questions.length > 0 && (
                        <QuestionCard
                            question={questions[currentQuestionIndex]}
                            onAnswer={handleAnswer}
                            userAnswer={userAnswers[currentQuestionIndex]}
                            onNavigate={handleNavigation}
                            currentIndex={currentQuestionIndex}
                            totalQuestions={questions.length}
                            onSubmit={handleSubmitQuiz}
                        />
                    )}
                        
                        </Box>
                    </Box>

                    <ResultDialog open={showResults} onClose={() => setShowResults(false)} score={score} totalQuestions={questions.length} />
            </Box>


);


}