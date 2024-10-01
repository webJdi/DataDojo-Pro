'use client'

import { collection, writeBatch, doc, getDoc, setDoc, query,where, getDocs, onSnapshot} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Container,Link, Typography, Card, Box,Grid, Paper, TextField, Button, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useState} from "react";
import {auth, db} from '../../firebase';
import Head from 'next/head';
import { useEffect } from "react";
import useLogout from '../../components/logout';


//Component

import Navbar from "../../components/navbar";

import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';
import { CircularProgress } from "@mui/material";
import { ImportExport } from "@mui/icons-material";




export default function Generate({params}){
    const {card} = params;
    console.log(card);
    // Redirect section
    const router = useRouter(); 
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const handleLogout = useLogout();

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


    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    
    const [open, setOpen] = useState(false)
    
    const fetchFlashcards = async () => {
        const cardRef = collection(db, "cards");
        const querySnapshot = await getDocs(cardRef);
        const cardTitles = querySnapshot.docs.map((doc) => doc.id);
        console.log(cardTitles)
        const dcard = decodeURIComponent(card)
        console.log(dcard)
        try {
          const cardDoc = await getDoc(doc(db, "cards", dcard));
    
          if (cardDoc.exists()) {
            const cardData = cardDoc.data();
            console.log("Card data:", cardData);
            if (cardData.flashcards && Array.isArray(cardData.flashcards)) {
              setFlashcards(cardData.flashcards);
              setFlipped(new Array(cardData.flashcards.length).fill(false));
            } else {
              console.log("No flashcards found in the document.");
            }
          } else {
            console.log("No card found with this id.");
          }
        } catch (error) {
          console.error("Error fetching flashcards:", error);
        }
      };
    
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
    
    useEffect(() => {
        if (card) {
          fetchFlashcards();
        }
      }, [card]);

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


    return(
        
        
            <Box
            width={'100vw'}
            minHeight={'100vh'}
            backgroundColor={col1}
            display={'flex'}
            flexDirection={'row'}
            overflow={'hidden'}
            >
            
            <Navbar/>
            
            {
                flashcards.length>0 && (<Box width={'80vw'} sx={{mt:4}}>
                    <Typography
                        variant="h5"
                        color={col4}
                        textAlign={'center'}
                        fontWeight={'100'}
                    >
                        Flashcards Viewer
                    </Typography>
                    <Box
                        width={'100%'}
                        display={'flex'}
                        marginTop={'1em'}
                        justifyContent={'center'}
                    >
                    <Box
                                            width={'60vw'}
                                            height={'85vh'}
                                            overflow={'hidden'}
                                        >
                    <Grid container spacing={3}
                    
                    >
                        {flashcards.map((flashcard, index) =>
                            (  <Grid item xs={6} sm={6} md={3} key = {index}
                                
                                >
                                <Card
                                sx={{background:col1, borderRadius:'0.5em'}}
                                >
                                    <CardActionArea
                                        sx={{background:col4, borderRadius:'0.5em'}}
                                        onClick={() => {
                                            handleCardClick(index)
                                        }}
                                        backgroundColor={col1}
                                    >
                                        <CardContent
                                            sx={{background:col6, borderRadius:'0.5em'}}
                                        >
                                            <Box
                                                backgroundColor={col6}
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
                                                            variant="h5"
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
                    
                </Box>
            )}
            </Box>
        

    )
}