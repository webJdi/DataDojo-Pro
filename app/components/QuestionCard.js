import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const col6 = ['#3D405B']; // Dark shade
const col2 = ['#E07A5F']; // red
const col3 = ['#81B29A']; // green
const col4 = ['#F4F1DE']; // white
const col5 = ['#F2CC8F']; // yellow
const col1 = ['#191c35']; // Darkest shade
const col7 = ['#5FA8D3']; //Blue
const col8 = ['#2b2d44']; //Darker shade

const QuestionCard = ({ question, onAnswer, userAnswer, onNavigate, currentIndex, totalQuestions, onSubmit }) => {
    const answerOptions = ['A', 'B', 'C', 'D'];

    return (
        <Box
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'flex-start'}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
                height="100%"
                width={'50vw'}
            >
                <Typography
                    variant="h5"
                    color="white"
                    mb={2}
                    fontSize={'0.9em'}
                    textAlign={'left'}
                >
                    Question {currentIndex + 1} of {totalQuestions}
                </Typography>
                <Typography variant="h6" color="white" mb={4}>
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
                                
                                color: 'white',
                                borderColor: 'rgba(255, 255, 255, 0.1)',
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
                <Image
                src={'/bg2.jpg'}
                width={'500'}
                height={'350'}
                margin={'0 auto'}
                
            />
            <Box display="flex" justifyContent="space-between" width="100%" mt={4}>
                    <Button 
                        onClick={() => onNavigate('prev')} 
                        disabled={currentIndex === 0} 
                        variant="contained" 
                        color="primary"
                        sx={{background:col5,
                            color:col6,
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
                                    color:col5,
                                    
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