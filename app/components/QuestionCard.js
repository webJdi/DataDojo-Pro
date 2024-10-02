import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { doc, onSnapshot} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect} from "react";
import {auth, db} from '../firebase';
import useMediaQuery from '@mui/material/useMediaQuery';


const QuestionCard = ({ question, onAnswer, userAnswer, onNavigate, currentIndex, totalQuestions, onSubmit }) => {
    const answerOptions = ['A', 'B', 'C', 'D'];
    const router = useRouter(); 
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

        const isMobile = useMediaQuery('(max-width:450px)');

        useEffect(() => {
        
            const unsubscribe = auth.onAuthStateChanged((user) => {
                
                if (user) {
    
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
            });
            return () => {
                unsubscribe();                
            };
        }, [router]);

    return (
        <Box
            display={'flex'}
            flexDirection={isMobile?'column':'row'}
            justifyContent={'flex-start'}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
                height="100%"
                width={isMobile?'85vw':'50vw'}
            >
                <Typography
                    variant="h5"
                    color={col4}
                    mb={2}
                    fontSize={'0.9em'}
                    textAlign={'left'}
                >
                    Question {currentIndex + 1} of {totalQuestions}
                </Typography>
                <Typography variant="h6" color={col4} mb={4}>
                    {question.question}
                </Typography>
                <Box display="flex" flexDirection="column" width="100%" maxWidth="500px" mb={4}>
                    {answerOptions.map((option) => (
                        <Button
                            key={option}
                            variant={userAnswer === option ? "contained" : "outlined"}
                            onClick={() => onAnswer(option)}
                            sx={{
                                mb: 2,
                                justifyContent: "flex-start",
                                textAlign: "left",
                                border:'none',
                                color: col4,
                                
                                
                                padding:'1em',
                                '&:hover': {
                                    backgroundColor: col3,
                                },
                                '&.Mui-disabled': {
                                    color: 'rgba(255, 255, 255, 0.5)',
                                },
                            }}
                        >
                            <Typography variant="body1" component="span" sx={{ mr: 2 }}>
                                {option}.
                            </Typography>
                            {question[option]}
                        </Button>
                    ))}
                </Box>
                
            </Box>

            <Box
                borderRadius={'0.3em'}
                overflow={'hidden'}
                width={'500'}
                height={'350'}
            >
                <Box
                    sx={{display:isMobile? 'none':'static'}}
                >
                <Image
                    src={'/bg2.jpg'}
                    width={'500'}
                    height={'350'}
                    margin={'0 auto'}
                    
            />
                </Box>
                
            <Box display="flex" justifyContent="space-between" width="100%" mt={4}>
                    <Button 
                        onClick={() => onNavigate('prev')} 
                        disabled={currentIndex === 0} 
                        variant="contained" 
                        color="primary"
                        sx={{background:col5,
                            color:'#444',
                            '&:hover':
                            {
                                background:col6,
                                color:col5
                            }
                        }}
                    >
                        <ArrowBackIosIcon/>
                        Previous
                    </Button>
                    {currentIndex === totalQuestions - 1 ? (
                        <Button 
                            onClick={onSubmit} 
                            variant="contained" 
                            color="secondary"
                            sx={{background:col2}}
                        >
                            Submit Quiz
                        </Button>
                    ) : (
                        <Button 
                            onClick={() => onNavigate('next')} 
                            variant="contained" 
                            color="primary"
                            sx={{background:col5,
                                color:col6,
                                padding:'0.2em 1em',
                                '&:hover':
                                {
                                    background:col6,
                                    color:'#444',
                                    
                                }
                            }}
                        >
                            Next <ArrowForwardIosIcon/>
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default QuestionCard;