"use client";

import {
    Box,
    Typography,
    IconButton,
    Stack,
    Link
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BookIcon from "@mui/icons-material/Book";

import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const col6 = "#3D405B";
const col2 = "#E07A5F";
const col3 = "#81B29A";
const col4 = "#F4F1DE";
const col5 = "#F2CC8F";
const col1 = "#191c35";

export default function Profile() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [name, setName] = useState("");
    const [cards, setCards] = useState([]);
    const [yourScore, setYourScore] = useState("");
    const [highestScore, setHighestScore] = useState("");

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

    const getCards = async () => {
        try {
            const cardsRef = collection(db, "cards");
            const qSnap = await getDocs(cardsRef);
            const cardTitles = qSnap.docs.map((doc) => doc.id);
            setCards(cardTitles);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    };

    useEffect(() => {
        getMaxScore();
        getCards();

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoading(false);
                getNameByEmail(user.email);
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
            width="100vw"
            height="100vh"
            bgcolor={col1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
        >
            <Box
                width={{ xs: '95vw', sm: '85vw', md: '45vw' }}
                height="95vh"
                bgcolor={col4}
                borderRadius="20px"
                overflow="hidden"
                display="flex"
                flexDirection="column"
            >
                <Box p={2}>
                    <IconButton onClick={() => router.back()} sx={{ color: col1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                </Box>

                <Stack spacing={3} sx={{ px: 4, pb: 4, overflowY: 'auto', flexGrow: 1 }}>
                    <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: col1 }}>
                        {name}'s Profile
                    </Typography>

                    <Box sx={{ bgcolor: col2, p: 2, borderRadius: '10px' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <StarIcon sx={{ color: col4 }} />
                            <Typography variant="h6" sx={{ color: col4 }}>
                                Core Score: {yourScore}
                            </Typography>
                        </Stack>
                    </Box>

                    <Box sx={{ bgcolor: col2, p: 2, borderRadius: '10px' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <EmojiEventsIcon sx={{ color: col4 }} />
                            <Typography variant="h6" sx={{ color: col4 }}>
                                High Score: {highestScore}
                            </Typography>
                        </Stack>
                    </Box>

                    <Typography variant="h5" sx={{ color: col1, fontWeight: 'bold' }}>
                        Flashcards History
                    </Typography>

                    {cards.length === 0 ? (
                            <Typography
                                variant="body1"
                                textAlign="center"
                                sx={{ color: col1 }}
                            >
                                No flashcard history yet.
                            </Typography>
                        ) : (
                            <Stack spacing={2}>
                                {cards.map((card) => (
                                    <Link 
                                        key={card} 
                                        href={`./flashcards/${card}`} // Navigation Link 
                                        underline="none" // Remove underline from Link 
                                        sx={{ 
                                            display: "block",  // Make the entire Link clickable
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                bgcolor: "white",
                                                p: 2,
                                                borderRadius: "10px",
                                                boxShadow: 1,
                                                '&:hover': { // Add a hover effect
                                                    bgcolor: col2, 
                                                    color: col4 
                                                }
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={1}
                                            >
                                                <BookIcon sx={{ color: col1 }} />
                                                <Typography
                                                    variant="body1"
                                                    sx={{ color: col1 }}
                                                >
                                                    {card}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Link> 
                                ))}
                            </Stack>
                        )}
                </Stack>
            </Box>
        </Box>
    );
}