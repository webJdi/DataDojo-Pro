'use client';
//MUI components
import { Box, Link, Typography, Button, Stack, Modal, Drawer, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import useMediaQuery from '@mui/material/useMediaQuery';

//MUI Icons used: Keep adding here to have a consistent dependency
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';

import MoodIcon from '@mui/icons-material/Mood';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';



//Import component
import useLogout from './logout';

//Import react components
import { useState, useEffect } from "react";
import { useRouter, usePathname} from "next/navigation";

//Import firebase config & firestore components
import {auth, db} from '../firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, onSnapshot } from "firebase/firestore";


const logout = useLogout();

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const [mode, setMode] = useState('dark');
    const [email, setEmail] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);


    // Media query for detecting screen size
    const isMobile = useMediaQuery('(max-width:600px)');

    // state variables for colour mode
    const [col1, setCol1] = useState('#191c35'); // Darker shade
    const [col2, setCol2] = useState('#E07A5F'); // red
    const [col3, setCol3] = useState('#81B29A'); // green
    const [col4, setCol4] = useState('#F4F1DE'); // white
    const [col5, setCol5] = useState('#F2CC8F'); // yellow
    const [col6, setCol6] = useState('#3D405B'); // Dark shade
    const [col7, setCol7] = useState('#5FA8D3'); //Blue
    const [col8, setCol8] = useState('#2b2d44'); //Darker shade

    const handleMode = async(event, newmode) => {
        if(newmode!=null)
        {
            setMode(newmode);
            const userRef = doc(db, 'users', email); // Reference to the user's document
            await updateDoc(userRef, { mode: newmode});    
        }
        if(newmode == "light")
        {
            setCol1('#EDE8E2');
            setCol2('#E07A5F');
            setCol3('#81B29A');
            setCol4('#000');
            setCol5('#F2CC8F');
            setCol6('#F4F1ED');
            setCol7('#5FA8D3');
            setCol8('#FFF'); //
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
    

    const activeColor = col1;
    
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const isActive = (path) => pathname === path;

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            setLoading(true);
            const usersRef = collection(db, "users");
            const q = query(usersRef, orderBy("score", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLeaderboardData(data);
            setLoading(false);
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("Auth state changed:", user ? "User logged in" : "User not logged in");
            if (user) {
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
                
            }
        }, (error) => {
            console.error("Auth error:", error);
            setAuthError(error.message);
            setIsLoading(false);
        });

        fetchLeaderboardData();
        return() => {
            unsubscribe();
        }
    }, []);

    const NavButton = ({ href, icon, text }) => (
        <Button
            fullWidth
            href={href}
            sx={{
                color: col4,
                textTransform: 'none',
                padding: '1em',
                textAlign: 'left',
                justifyContent: 'flex-start',
                backgroundColor: isActive(href) ? activeColor : 'transparent',
                '&:hover': {
                    color: col4,
                    backgroundColor: isActive(href) ? activeColor : col8,
                }
            }}
        >
            <Box width='15%'>
                {icon}
            </Box>
            <Typography
            >
                {text}
            </Typography>
        </Button>
    );

    return(
                    <Box
                        width={isMobile ? '100vw' : '20vw'}
                        height={isMobile? '8vh':'100vh'}
                        display='flex'
                        boxSizing={'border-box'}
                        justifyContent='space-between'
                        flexDirection={isMobile ? 'row' : 'column'}
                        alignItems='center'
                        padding={isMobile ? '0 1vw' : '1vw'}
                        bgcolor={col6}
                        >
                            <Typography
                            color={col4}
                            margin='0.5em'
                            fontSize={isMobile ? '1em' : '2em'}
                            textAlign={'left'}
                            borderBottom={'1px solid rgba(0,0,0,0.3)'}
                            >
                                <Link
                                    color='inherit'
                                    underline='none'
                                    href='./'
                                    textAlign={'left'}
                                    
                                >
                                    DataDojo
                                </Link>
                            </Typography>
                            
                            {/*///////// Light modes  /////////////*/}
                            <ToggleButtonGroup
                                color="primary"
                                size="small"
                                value={mode}
                                exclusive
                                onChange={handleMode}
                                sx={{
                                  '& .MuiToggleButtonGroup-grouped': {
                                    color: col4, 
                                    borderColor: 'rgba(256,256,256,0.1)', 
                                    '&.Mui-selected': {
                                      backgroundColor: col1,
                                      color: col4,
                                      borderColor: 'rgba(256,256,256,0.2)',
                                    },
                                  },
                                }}
                                >
                                    <ToggleButton value="light"><LightModeIcon/></ToggleButton>
                                    <ToggleButton value="dark"><DarkModeIcon/></ToggleButton>
                                    
                            </ToggleButtonGroup>

                            
                            <Button
                                display={isMobile? 'static':'none'} // Button for mobile menu
                                onClick={toggleDrawer(true)}
                            >
                                <MenuIcon/>
                            </Button>

                            <Drawer
                                anchor="top"
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                            >
                                <Box
                                    bgcolor={col1}
                                >
                                    <NavButton href="/dashboard" icon={<HomeIcon />} text="Dashboard" />
                                    <NavButton href="/chat" icon={<SupportAgentIcon />} text="Socratic Bot" />
                                    <NavButton href="/editor" icon={<CodeIcon />} text="Code Editor" />
                                    <NavButton href="/fcgen" icon={<BoltIcon />} text="Flashcards" />
                                    <NavButton href="/test" icon={<DynamicFormIcon />} text="Mock Test" />
                                </Box>
                            </Drawer>


                            <Box
                                display={isMobile? 'none':'flex'}
                                flexDirection={isMobile ? 'row' : 'column'} // Change layout for mobile
                                width={isMobile ? 'auto' : '100%'}
                                justifyContent={'flex-start'}
                                height={'60vw'}
                                
                                paddingTop={'5vh'}
                            >
                                <NavButton href="/dashboard" icon={<HomeIcon />} text="Dashboard" />
                                <NavButton href="/chat" icon={<SupportAgentIcon />} text="Socratic Bot" />
                                <NavButton href="/editor" icon={<CodeIcon />} text="Code Editor" />
                                <NavButton href="/fcgen" icon={<BoltIcon />} text="Flashcards" />
                                <NavButton href="/test" icon={<DynamicFormIcon />} text="Mock Test" />


                                <Button
                                    fullWidth
                                    onClick={handleOpen}
                                    
                                    sx={{color:col4,
                                        textTransform: 'none',
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col4,
                                            backgroundColor:col8
                                        }

                                    }}
                                >
                                    
                                    
                                    <Box
                                        width={'15%'}
                                    >
                                        <LeaderboardIcon />
                                    </Box>
                                    <Typography>
                                        Leaderboard
                                    </Typography>
                                </Button>

                                {/*/////////////// Modal ///////////////////*/}
                            
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box
                                        width={'40vw'}
                                        maxHeight={'50vh'}
                                        overflow={'auto'}
                                        sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        
                                        bgcolor: col6,
                                        color:col4,
                                        boxShadow: 24,
                                        p: 4,
                                    }}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                                            Leaderboard
                                        </Typography>
                                        {loading ? (
                                            <CircularProgress />
                                        ) : (
                                            <TableContainer
                                                component={Paper}
                                                
                                                sx={{
                                                    bgcolor:'#fff',
                                                    color:col4
                                                }}
                                            >
                                                <Table
                                                    overflow={'auto'}
                                                    sx={{ minWidth: 350 }}
                                                    aria-label="leaderboard table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Rank</TableCell>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell align="right">Score</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {leaderboardData.map((row, index) => (
                                                            <TableRow
                                                                key={row.id}
                                                                sx={{ 
                                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                                    backgroundColor: row.email === auth.currentUser?.email ? col3 : 'inherit'
                                                                }}
                                                            >
                                                                <TableCell component="th" scope="row">
                                                                    {index + 1}
                                                                </TableCell>
                                                                <TableCell>{row.name}</TableCell>
                                                                <TableCell align="right">{row.score}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </Box>
                                </Modal>
                                
                            </Box>
                            
                            <Box
                                width={'100%'}
                                display={isMobile?'none':'flex'}
                            >
                                
                                <Button
                                    fullWidth
                                    href='./profile/'
                                    sx={{color:col4,
                                        textTransform: 'none',
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <Box
                                        width={'15%'}
                                    >
                                        <Person4Icon/>
                                    </Box>
                                    <Typography>
                                        Profile
                                    </Typography>
                                    
                                </Button>
                                <Button
                                    fullWidth
                                    
                                    onClick={logout}
                                    sx={{color:col4,
                                        textTransform: 'none',
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <Box
                                        width={'15%'}
                                    >
                                        <LogoutIcon/>
                                    </Box>
                                    <Typography>
                                        Logout
                                    </Typography>
                                    
                                    
                                </Button>
                            </Box>
                            
                            

                        </Box>
                        )

}
export default Navbar;