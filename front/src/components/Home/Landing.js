import BuyCard from "./BuyCard";
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link as Scroll } from 'react-scroll';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import {motion} from "framer-motion"
import {CssBaseline } from '@mui/material';

function Landing() {

  let navigate = useNavigate();

  const goToAuctions = () =>{
    navigate("/auctions");
  }

  const goToLogin = () =>{
    navigate("/login");
}

const kind = [
  {
    title: 'Sell',
    description:
      "Selling with us is rather easy. You have absolute control over the price, duration of the auction and availability for immediate purchase. All you have to do is create an account and when you are confirmed you are ready to post your first listing!",
    imageUrl: "http://localhost:33123/images/kobuR.jpg",
    time: 1500,
  },
  {
    title: 'Buy',
    description:
      'In our auctions, items are bid on and sold to the highest bidder on a public sale. We ensure a safe transaction between seller and buyer and you can communicate securely within our mail app. Feel free to explore our catalogue before joining here!',
    imageUrl: "http://localhost:33123/images/saadR.jpg",
    time: 1500,
  },
];

  return (
    <div style={{
      minHeight: '100vh', 
      width: '100%',
      background: 'linear-gradient(-45deg, #0d1117, #161b22, #000000, #0a0a0a)',
      backgroundSize: '400% 400%',
      animation: 'gradientBG 15s ease infinite',
      position: 'relative'
    }}>
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(200, 50, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(50, 150, 255, 0.15) 0%, transparent 40%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      
      <CssBaseline />
      <motion.div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Inter, Futura, sans-serif',
        position: 'relative',
        zIndex: 1
      }} id="header"
      initial={{opacity: 0, scale: 0.95}}
      animate={{opacity: 1, scale: 1}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      exit={{opacity: 0}}
      >
      <AppBar style={{background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(5px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }} elevation={0}>
        <Toolbar style={{width: '90%', maxWidth: '1400px', margin: '0 auto', padding: '15px 0' }}>
          <h1 style={{ flexGrow: '1', fontSize: '2.4rem', color: '#fff', fontWeight: '800', letterSpacing: '-1px' }} >
            Anurag shopify
          </h1>
          <IconButton onClick={goToLogin}>
            <ExitToAppIcon style={{    color: '#fff',
    fontSize: '2rem', }} />
          </IconButton>
        </Toolbar>
      </AppBar>

            <div style={{ textAlign: 'center', zIndex: 10 }} >
              <motion.h1 
                initial={{y: 20, opacity: 0}} 
                animate={{y: 0, opacity: 1}} 
                transition={{delay: 0.2, duration: 0.8}}
                style={{ flexGrow: '1', fontSize: '6rem',
                  background: "-webkit-linear-gradient(45deg, #FF6B6B 0%, #4E65FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: '900',
                  lineHeight: '1.1',
                  margin: '0',
                  padding: '20px 0'
                }}  > 
                <div style={{ color: '#fff', fontSize: '3.5rem', fontWeight: '400', letterSpacing: '1px', WebkitTextFillColor: '#fff', paddingBottom: '10px' }}>
                  Welcome to <br />
                </div>
                Anurag shopify 
              </motion.h1>
          
          <Scroll to="DOWN" smooth={true}>
            <IconButton style={{ marginTop: '40px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ExpandMoreIcon style={{ color: '#fff', fontSize: '3rem', }} />
            </IconButton>
          </Scroll>

        </div>
        </motion.div>
        
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
          padding: '50px 0'
        }} 
        
        id="DOWN">
          <div onClick={goToAuctions} style={{ perspective: '1000px' }}>
            <BuyCard kind={kind[1]} />
          </div>
          <div onClick={goToLogin} style={{ perspective: '1000px' }}>
            <BuyCard kind={kind[0]}  />
          </div>
        </div>
    </div>
  );
}

export default Landing;
