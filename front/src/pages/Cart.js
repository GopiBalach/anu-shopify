import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import Title from '../components/Typography/Title';

import { Typography, Card, CardContent, CardMedia, Button, Box, Modal, Snackbar, Alert, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid lightBlue',
    borderRadius: 6,
    boxShadow: 24,
    p: 4,
};

function Cart() {
    let navigate = useNavigate();
    const { authState } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const [openModal, setOpenModal] = useState(false);
    
    // Payment specific state
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("credit");

    useEffect(() => {
        window.scrollTo(0, 0);
        const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(storedCart);
        calculateTotal(storedCart);
    }, []);

    const calculateTotal = (items) => {
        let total = 0;
        items.forEach(item => {
            total += parseFloat(item.buy_price || 0);
        });
        setTotalPrice(total);
    };

    const removeItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
        window.dispatchEvent(new Event("storage")); // Trigger storage event for Navbar sync if needed
        window.location.reload(); // Quick sync hack for navbar
    };

    const handleCheckoutPreview = () => {
        if (!authState.status) {
            setAlertMessage("You must be logged in to checkout!");
            setOpenAlert(true);
            return;
        }
        setOpenPaymentModal(true);
    };

    const handleConfirmPayment = async () => {
        setOpenPaymentModal(false);
        setOpenModal(true);

        const head = {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
        };

        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            const body = {
                userId: authState.id,
                purchaseAmount: item.buy_price,
                sellerId: item.UserId,
            };

            await axios.put(`http://localhost:33123/items/purchase/${item.id}`, body, head);
            const historyBody = { userId: authState.id };
            await axios.post(`http://localhost:33123/history/bid/${item.id}`, historyBody, head);
        }

        // Clear cart
        localStorage.removeItem('cartItems');
        window.dispatchEvent(new CustomEvent('cartUpdated')); // Update the floating cart icon dynamically
        setCartItems([]);
        setTotalPrice(0);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        navigate('/');
        window.location.reload();
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            <div className="container">
                <Title title="Your Cart" />
            </div>

            <div className="container" style={{ flexDirection: 'column', alignItems: 'center' }}>
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <Typography variant="h4" sx={{ fontFamily: 'Futura', color: '#00C9FF' }}>
                            Your cart is empty
                        </Typography>
                        <br />
                        <Button variant="contained" sx={{ backgroundColor: '#00C9FF' }} onClick={() => navigate('/auctions')}>
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        {cartItems.map((item, index) => (
                            <Card key={index} style={{
                                width: '800px',
                                display: 'flex',
                                marginBottom: '20px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '15px'
                            }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 250, borderRight: '1px solid rgba(255,255,255,0.1)' }}
                                    image={item.coverPhoto || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"}
                                    alt={item.name}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography component="div" variant="h5" sx={{ fontFamily: 'Futura', color: 'white' }}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="subtitle1" component="div" sx={{ fontFamily: 'Futura', color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Price: €{item.buy_price}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 2, px: 2, justifyContent: 'flex-end' }}>
                                        <Button variant="outlined" color="error" onClick={() => removeItem(item.id)}>
                                            Remove
                                        </Button>
                                    </Box>
                                </Box>
                            </Card>
                        ))}

                        <div style={{
                            width: '800px',
                            padding: '20px',
                            background: 'rgba(0,0,0,0.5)',
                            borderRadius: '15px',
                            border: '1px solid #00C9FF',
                            marginTop: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="h4" sx={{ fontFamily: 'Futura', color: 'white' }}>
                                Total: €{totalPrice}
                            </Typography>
                            <Button variant="contained" sx={{ backgroundColor: '#00C9FF', height: '50px', fontSize: '18px' }} onClick={handleCheckoutPreview}>
                                Checkout
                            </Button>
                        </div>
                    </>
                )}
            </div>

            <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="warning" sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>

            {/* Payment Modal */}
            <Modal open={openPaymentModal} onClose={() => setOpenPaymentModal(false)}>
                <Box sx={{ ...style, width: 450 }}>
                    <Typography variant="h5" sx={{ fontFamily: 'Futura', color: '#00C9FF', mb: 3 }}>
                        Payment Details
                    </Typography>
                    
                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <FormLabel component="legend" sx={{ color: 'black', mb: 1 }}>Select Payment Method</FormLabel>
                        <RadioGroup 
                            value={paymentMethod} 
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <FormControlLabel value="credit" control={<Radio color="primary" />} label="Credit / Debit Card" sx={{ color: 'black' }} />
                            <FormControlLabel value="paypal" control={<Radio color="primary" />} label="PayPal" sx={{ color: 'black' }} />
                            <FormControlLabel value="cash" control={<Radio color="primary" />} label="Cash on Delivery" sx={{ color: 'black' }} />
                        </RadioGroup>
                    </FormControl>

                    <div style={{ padding: '20px 0', borderTop: '1px solid #eee', marginTop: '20px' }}>
                        <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                            Order Total: €{totalPrice}
                        </Typography>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' }}>
                        <Button color="inherit" onClick={() => setOpenPaymentModal(false)}>Cancel</Button>
                        <Button variant="contained" sx={{ backgroundColor: '#00C9FF' }} onClick={handleConfirmPayment}>
                            Confirm Payment
                        </Button>
                    </div>
                </Box>
            </Modal>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ fontFamily: 'Futura', color: 'black' }}>
                        Purchase Successful!
                    </Typography>
                    <img alt="Success" style={{ width: '100%', height: 'auto', borderRadius: '15px', marginTop: '15px' }} src='https://cdn.dribbble.com/users/1751799/screenshots/5512482/check02.gif' />
                    <Typography variant="h6" sx={{ mt: 2, fontFamily: 'Futura', color: 'black' }}>
                        Thank you for your purchase via {paymentMethod === 'credit' ? 'Credit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery'}. The sellers have been notified and you will be contacted shortly.
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Button className="buttonito" onClick={handleCloseModal}>Continue</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default Cart;
