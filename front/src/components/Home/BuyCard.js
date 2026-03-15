import React from 'react';
import { Typography, Card, CardContent ,CardMedia } from '@mui/material';

// Simple card to display the landing page's two cards
export default function BuyCard(props) {

  return (

      <Card style={{ maxWidth: 645,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        margin: '20px',
        transition: 'transform 0.3s ease-in-out',
        cursor: 'pointer',
         }}
         onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
         onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
         >
          <CardMedia
            style={{height: 440, borderRadius: '20px 20px 0 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            component="img"
            src={props.kind.imageUrl}
            alt={props.kind.title}
          />

        <CardContent style={{ padding: '30px' }}>
          <Typography
            gutterBottom
            variant="h4"
            component="h1"
            style= {{fontFamily: 'Inter, Futura, sans-serif', fontWeight: '800',
            fontSize: '2.5rem', color: '#fff', letterSpacing: '0.5px', marginBottom: '15px' }}
          >
            {props.kind.title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            style={{ fontFamily: 'Inter, Futura, sans-serif',
            fontSize: '1.15rem',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.75)', }}
          >
            {props.kind.description}
          </Typography>
        </CardContent>

      </Card>
      
  );

}
