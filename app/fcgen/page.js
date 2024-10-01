'use client'

import { collection, writeBatch, doc, getDoc, setDoc, onSnapshot} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Container,Link, Typography, Card, Box, Grid, Paper, TextField, Button, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useState} from "react";
import {auth, db} from '../firebase';
import Head from 'next/head';
import { useEffect } from "react";
import useLogout from '../components/logout';
import Image from "next/image";

//Components
import Navbar from "../components/navbar";

import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';
import { CircularProgress } from "@mui/material";


export default function Generate(){

    // Redirect section
    const router = useRouter(); 
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const handleLogout = useLogout();

    
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    

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

    const handleSubmit =async() =>{
        
        fetch('api/fcgen',{
            method: 'POST',
            body:text,
        })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
        console.log(flashcards)
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))

    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    
    const saveFlashcards = async() => {
        if(!name)
        {
            alert('Please enter a name')
            return
        }

        try {
            await setDoc(doc(db, "cards", name), {
              flashcards: flashcards,
            });
            alert("Flashcards saved!");
          }
          catch (error) {
            
            console.error("Error saving thread: ", error);
            alert("Error saving thread: " + error.message);
          }
          
        
        handleClose()
        router.push('/dashboard')
    }

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


        // Redirect section ends

    const bgOne = '#40407a'
    const bgTwo = '#706fd3'
    const bgThree = "#fff"

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
                        sx={{
                            position:'fixed',
                            top:'24vh',
                            right:'-100px',
                            transform:'rotateZ(-45deg)'
                        }}
                    >
                        <Image
                                src={'/tarot-card.png'}
                                width={'300'}
                                height={'300'}
                                
                            />
                    </Box>
                        
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
                                Flashcards
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
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        label="Enter your flashcard prompt"
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
                                        Submit
                                        <BoltIcon></BoltIcon>
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
                            {
                                flashcards.length>0 && (<Box>
                                    <Typography
                                        variant="h5"
                                        color={col4}
                                        textAlign={'left'}
                                        fontWeight={'100'}
                                    >
                                        Flashcards Preview
                                    </Typography>

                                    <Typography
                                        variant="p"
                                        color={col4}
                                    >
                                        Review and save the generated flashcards
                                    </Typography>

                                    <Box
                                        width={'100%'}
                                        display={'flex'}
                                        marginTop={'1em'}
                                        justifyContent={'flex-start'}
                                    >
                                        <Box
                                            width={'60vw'}
                                            height={'60vh'}
                                            overflow={'hidden'}
                                        >
                                            <Grid container spacing={4}
                                            
                                            >
                                        {flashcards.map((flashcard, index) =>
                                            (  <Grid item xs={6} sm={6} md={3} key = {index}
                                                
                                                >
                                                <Card
                                                sx={{background:col1, borderRadius:'0.5em'}}
                                                >
                                                    <CardActionArea
                                                        sx={{background:col1, borderRadius:'0.5em'}}
                                                        onClick={() => {
                                                            handleCardClick(index)
                                                        }}
                                                        backgroundColor={col1}
                                                    >
                                                        <CardContent
                                                            sx={{background:col6, borderRadius:'0.5em'}}
                                                        >
                                                            <Box
                                                                
                                                                sx={{
                                                                    fontWeight:'200',
                                                                    perspective: '1000px',
                                                                    '&>div': {
                                                                        transition: 'transform 0.6s',
                                                                        transformStyle: 'preserve-3d',
                                                                        position: 'relative',
                                                                        width:'100%',
                                                                        height:'150px',
                                                                        boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.6)',
                                                                        transform: flipped[index]
                                                                        ? 'rotateY(180deg)'
                                                                        : 'rotateY(0deg)',
                                                                    },
                                                                    '& > div > div': {
                                                                        transition: 'transform 0.6s',
                                                                        transformStyle: 'preserve-3d',
                                                                        position: 'absolute',
                                                                        width:'100%',
                                                                        height:'100%',
                                                                        backfaceVisibility: "hidden",
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        padding: 2,
                                                                        boxSizing: 'border-box'
                                                                    },
                                                                    '& > div > div:nth-of-type(2)': {
                                                                        transform: 'rotateY(180deg)'
                                                                    },

                                                                }}
                                                            >
                                                                <div>
                                                                    <div
                                                                        display={'flex'}
                                                                    >
                                                                        <Box
                                                                            width={'20%'}
                                                                            height={'100%'}
                                                                            display={'flex'}
                                                                            alignItems={'center'}
                                                                        >
                                                                            <Typography
                                                                            color={col5}
                                                                            variant="h6"
                                                                            fontSize={'0.8em'}
                                                                            textAlign={'center'}
                                                                            display={'block'}
                                                                            fontWeight={'800'}
                                                                            >
                                                                                <BoltIcon />
                                                                            </Typography>
                                                                        </Box>
                                                                        <Box
                                                                            width={'80%'}
                                                                            height={'100%'}
                                                                            display={'flex'}
                                                                            alignItems={'center'}
                                                                        >
                                                                        <Typography
                                                                            variant="h6"
                                                                            fontSize={'1.1em'}
                                                                            component="div"
                                                                            color={col4}
                                                                        >
                                                                            
                                                                            {flashcard.front}
                                                                        </Typography>
                                                                        </Box>
                                                                        
                                                                    </div>
                                                                    <div>
                                                                        <Typography
                                                                            variant="h5"
                                                                            fontWeight={'100'}
                                                                            fontSize={'1em'}
                                                                            textAlign={'center'}
                                                                            component="div"
                                                                            color={col4}
                                                                        >
                                                                            {flashcard.back}
                                                                        </Typography>
                                                                    </div>
                                                                </div>
                                                            </Box>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                            
                                            )
                                        )}
                                    </Grid>
                                    </Box>
                                    </Box>
                                    <Box sx={{mt:4, display:'flex', justifyContent:'center'}}>
                                        <Button
                                            variant="contained"
                                            onClick={handleOpen}
                                            position={'fixed'}
                                            zIndex={'10'}
                                            bottom={'2vh'}
                                            left={'50%'}
                                            sx={{
                                                backgroundColor:col3
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        
                        </Box>
                    </Box>


                    <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle
                >
                    Save Flashcards
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    >

                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
            </Box>

    )
}