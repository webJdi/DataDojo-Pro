'use client'

import { Box, Typography, Stack, TextField, Button, Link, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ToggleButtonGroup, ToggleButton} from "@mui/material";
import { useEffect, useState, useRef, classes} from "react";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import {auth, db} from '../firebase';
import { collection, addDoc, doc, setDoc, onSnapshot} from 'firebase/firestore';
import { useRouter } from "next/navigation";
import useLogout from '../components/logout';
import {CircularProgress} from '@mui/material';


//Components
import Navbar from "../components/navbar";

import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';

import { Save } from "lucide-react";




export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! I'm here to assist you with DSA, using the Socratic method to guide your learning. Let's dive in and chat!",
    },
  ]);
  

  const [bgOne, setBgOne] = useState("#D9D9D9");
  const [bgTwo, setBgTwo] = useState("#BDC3C7");
  const [bgThree, setBgThree] = useState("#FFFFFF");
  const [bgFour, setBgFour] = useState("#786fa6");
  const [colorOne, setcolorOne] = useState('#111');
  const [glowOne, setglowOne] = useState('0 0 30px 1px #786fa6');
  const [buttonOne, setbuttonOne] = useState('#786fa6');
  const [buttonTwo, setbuttonTwo] = useState('#fff');
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const handleLogout = useLogout();
  const [documentName, setDocumentName] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);


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


  // Redirect section
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);



  const darkMode = () => {
    if (mode === "light") {
      setMode("dark");
      setBgOne("#34495e");
      setBgTwo("#2c3e50");
      setBgThree("#111");
      setBgFour("#1abc9c");
      setcolorOne('#fff');
      setglowOne('0 0 40px 4px #D6A2E8');
      setbuttonOne('#786fa6');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
      setOpen(false)
  }

  const handlePrivacy = async(event, privacy) => {
    if (privacy)
    {
      setPrivacy(privacy);
    }

  }

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' }
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: message }
          ]
        }) 
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      await reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text
            }
          ];
        });
        return reader.read().then(processText);
      });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const styles = theme => ({
    multilineInput:
    {
      color:'#fff'
    }

  })


  const saveThread = async () => {
    if (!documentName) {
      alert("Document name is required!");
      return;
    }
  
    try {
      if(privacy =='public')
        {        
      await setDoc(doc(db, "threads", documentName), {
        messages: messages,
        privacy: 'public'
      });
    }
    else
    {
      await setDoc(doc(db, "threads", documentName), {
        messages: messages,
        privacy: email
      });
    }
      alert("Thread saved successfully with document name: " + documentName);
      router.push('/dashboard');
    } catch (error) {
      console.log(documentName);
      console.error("Error saving thread: ", error);
      alert("Error saving thread: " + error.message);
    }
  };

  useEffect(() => {
    document.title = "Learn Buddy";
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("Component mounted, starting auth check");
    const timeoutId = setTimeout(() => {
        if (isLoading) {
            console.log("Auth check timed out");
            setAuthError("Authentication check timed out");
            setIsLoading(false);
        }
    }, 1200000); // 20 min timeout

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

  return (
    



    <Box
      backgroundColor={col1}
      width={'100vw'}
      height={'100vh'}
      overflow={'hidden'}
      boxSizing={'border-box'}
      display={'flex'}
      
    >
      <Navbar/>      
                        
      <Box
        height={'85vh'}
        padding={'1em'}
        width={{ xs: '90vw', sm: '80vw', md: '80vw' }}
      >
        <Stack
          direction={'column'}
          spacing={5}
          flexGrow={1}
          overflow={'auto'}
          maxHeight={'100%'}
          maxWidth={'100%'}
          disabled={isLoading}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display={'flex'}
              width={'100%'}
              marginBottom={{xs:'18vh'}}
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box color={col1} padding={'1em'} borderRadius={'2em'} bgcolor={
                message.role === 'assistant' ? col4 : col3
              }>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </Box>
      <Box
        position={"fixed"}
        bottom={{xs:'0',sm:'5vh',md:'5vh'}}
        right={'10vw'}
        width={{ xs: '90vw', sm: '80vw', md: '60vw' }}
        display={'flex'}
        alignContent={'center'}
        backgroundColor={col4}
        padding={'0.5em'}
        zIndex={'10'}
        borderRadius={'2em'}
      >
        <Box
        width={'100%'}
        
        >
          <TextField
            id="outlined-textarea"
            placeholder="Hey"
            multiline
            fullWidth
            label="Ask me anything"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: colorOne,
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
                color: colorOne,
              },
            }}
            InputProps={{
              sx: {
                color: colorOne,
              },
            }}
            InputLabelProps={{
              sx: {
                color: colorOne,
              },
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </Box>
        <Button
          onClick={sendMessage}
          disabled={isLoading}
          sx={{
            backgroundColor: 'transparent',
            color: col3,
            '&:hover': {
              backgroundColor: 'transparent',
              color: col1,
            },
          }}
        >
          <SendIcon />
         {/* {isLoading ? 'Sending...' : 'Send'} */}
        </Button>
        <Button
            onClick={handleOpen}
            sx={{
              backgroundColor: 'transparent',
              color: col3,
              '&:hover': {
                backgroundColor: 'transparent',
                color: col1,
              },
            }}
        >
            <SaveIcon />
        </Button>

        <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle
                >
                    Save Bot Thread
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
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        variant="outlined"
                    >

                    </TextField>
                    <ToggleButtonGroup
                                color="primary"
                                size="small"
                                value={privacy}
                                exclusive
                                onChange={handlePrivacy}
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
                                    <ToggleButton value="personal"><PersonIcon/></ToggleButton>
                                    <ToggleButton value="public"><PublicIcon/></ToggleButton>
                                    
                            </ToggleButtonGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveThread}>Save</Button>
                </DialogActions>
            </Dialog>

      </Box>
      
      
    </Box>

    
  );
}
