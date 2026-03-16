import React, { useState, useEffect } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { Badge, Drawer, Box, Typography, Button, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const removeFromCart = (id) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem('cartItems', JSON.stringify(newCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.currently || 0), 0);
  };

  if (cartItems.length === 0) {
    return null; // Don't show floating cart if it's empty
  }

  return (
    <>
      <div 
        onClick={toggleDrawer(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#00C9FF',
          color: 'white',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 201, 255, 0.4)',
          zIndex: 1000,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 201, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 201, 255, 0.4)';
        }}
      >
        <Badge badgeContent={cartItems.length} color="error" 
          sx={{ 
            '& .MuiBadge-badge': { 
              backgroundColor: '#ff3b3b',
              right: -5,
              top: -5,
            } 
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 28 }} />
        </Badge>
      </div>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderLeft: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', background: "-webkit-linear-gradient(45deg, #00C9FF 0%, #92FE9D 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Your Cart
            </Typography>
            <IconButton onClick={toggleDrawer(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
            {cartItems.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', mb: 3, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, p: 2 }}>
                <img src={item.coverPhoto} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                <Box sx={{ ml: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>{item.location}</Typography>
                  <Typography variant="h6" sx={{ color: '#00C9FF', mt: 'auto', mb: 0 }}>€{item.currently}</Typography>
                </Box>
                <IconButton onClick={() => removeFromCart(item.id)} sx={{ color: 'rgba(255,0,0,0.6)', alignSelf: 'flex-start' }}>
                  <CloseIcon fontSize="small"  />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 'auto', pt: 3 }}>
            <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h5" sx={{ color: '#00C9FF', fontWeight: 'bold' }}>€{calculateTotal()}</Typography>
            </Box>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => {
                setIsOpen(false);
                navigate('/cart');
              }}
              sx={{ 
                backgroundColor: '#00C9FF', 
                color: 'white', 
                py: 1.5, 
                fontWeight: 'bold',
                fontFamily: 'Inter, sans-serif',
                '&:hover': { backgroundColor: '#00aae0' } 
              }}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default FloatingCart;
