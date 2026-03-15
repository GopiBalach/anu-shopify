import React from 'react'
import './Search.css'
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import CategoriesSelect from './CategoriesSelect';
import Title from '../Typography/Title';
import Header from '../Typography/Header';
import Detail from '../Typography/Detail';

// Material UI components
import { Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ComputerIcon from '@mui/icons-material/Computer';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SnowboardingIcon from '@mui/icons-material/Snowboarding';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import HandymanIcon from '@mui/icons-material/Handyman';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Auctions() {
  
    const [itemList, setItemList] = useState([]);
    const [complete, setComplete] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({});
    let navigate = useNavigate();

    useEffect(()=>{
        setItemList([]);
        setComplete(false);
        
        // if no category selected bring everything
        if (Object.keys(selectedCategory).length <=0 ){
            axios.get(`http://localhost:33123/items`).then((res)=>{
                setItemList(res.data);
                setComplete(true);
            });
        }
        else{

            axios.get(`http://localhost:33123/items/categories/${selectedCategory.id}`).then((res)=>{
                setItemList(res.data);
                setComplete(true);
            });
        }

    }, [selectedCategory]);

    // Pagination Information
    const [pageNumber, setPageNumber] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    const handleChangeRows = (event) => {
      setItemsPerPage(event.target.value);
    };

    const visitedPages = pageNumber * itemsPerPage;
    const pageCount = Math.ceil(itemList.length / itemsPerPage);

    // Displaying the items of this particular page
    const displayItems = itemList.slice( visitedPages, visitedPages + itemsPerPage ).map((value, key)=>{
      return <div className='item' key={key} onClick={()=>{navigate(`/item/${value.id}`)}}> 
              <div className='name'>{value.name} </div>
              <div className='body'>
                  <img className='lando_image' src={value.coverPhoto} alt="coverphoto" />
              </div>
              <div className='footer gradient-custom'>
                  <div > {value.location}, {value.country}</div> 
                  <div style={{ color: '#14b6e3' }}> {value.currently} € &nbsp;&nbsp;</div>
              </div>
              </div>
    });
    
    const changePage = ({selected}) => {
        setPageNumber(selected);
    };

  return (
    <> 
    
      <div>
      
      <div style={{ paddingTop: '50px' }}>
      {  Object.keys(selectedCategory).length > 0  ?
        <Typography variant="h2" style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: '900', background: "-webkit-linear-gradient(45deg, #00C9FF 0%, #92FE9D 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: '20px' }}>{selectedCategory.name}</Typography>
        :
        <Typography variant="h2" style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: '900', background: "-webkit-linear-gradient(45deg, #FF6B6B 0%, #4E65FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: '20px' }}>Shop by Category</Typography>
      }
      </div>
        
      <div className="search">
        <div className="container" style={{
            marginTop: 3,
          }}>
          <Header text={<ComputerIcon style={{ color: '#00C9FF'}} />}  />
          <Header text={<PhotoCameraIcon style={{ color: '#00C9FF'}} />} />
          <Header text={<HandymanIcon style={{ color: '#00C9FF'}} />} />
          <Header text={<PetsIcon style={{ color: '#00C9FF'}} />} />
          <CategoriesSelect setSelectedCategory={setSelectedCategory} />
          <Header text={<ColorLensIcon style={{ color: '#00C9FF'}} />} />
          <Header text={<SnowboardingIcon style={{ color: '#00C9FF'}} />} />
          <Header text={<TwoWheelerIcon style={{ color: '#00C9FF'}} />} />
          <Header text={<CheckroomIcon style={{ color: '#00C9FF'}} />} />
        </div>

        <div className="search">

          { itemList.length===0 && complete &&
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', padding: '40px' }}>
              <Typography sx={{fontFamily: 'Inter, sans-serif', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase'}} variant="h4">
                No auctions found
              </Typography>
              <img style={{ width: '450px', borderRadius: '24px', margin: '30px 0', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(0, 201, 255, 0.4)' }} src='http://localhost:33123/images/empty_auctions.png' alt="no auctions found" />
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', fontFamily: 'Inter, sans-serif', textAlign: 'center', maxWidth: '600px', lineHeight: '1.6' }}>
                Unfortunately, there are no current listings {Object.keys(selectedCategory).length > 0 ? `for ${selectedCategory.name}` : 'available right now'}. Please check back later or explore other categories!
              </div>
            </div>
          }

          { itemList.length===0 && !complete &&
            <>
            <div className='container' style={{
              marginTop: 10,
            }}>
              <Typography sx={{fontFamily: 'Futura'}} variant="h4">
                              Loading
                      </Typography>       
                      </div>
                      <img alt="coverphoto" src='https://i.pinimg.com/originals/f2/9f/02/f29f025c9ff5297e8083c52b01f1a709.gif' />
              </>
          }


        { itemList.length!==0 && (
          
          <div className="container">
                
             {/* Display Items Paginated */}
             {displayItems}
                
                {/* The pagination */}
                <ReactPaginate 
                    previousLabel={"<"}
                    nextLabel={">"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"paginationButtons"}
                    previousLinkClassName={"previousButton"}
                    nextLinkClassName={"nextButton"}
                    disabledClassName={"paginationDisabled"}
                    activeClassName={"paginationActive"}
                />
           
              <div className="container">
              
                {/* Items per page */}
                  <Detail text={<div> 
                    <Box sx={{ minWidth: 100 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Items/Page</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={itemsPerPage}
                          label="items"
                          onChange={handleChangeRows}
                          variant="standard"
                        >
                          <MenuItem value={9}>9</MenuItem>
                          <MenuItem value={18}>18</MenuItem>
                          <MenuItem value={27}>27</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </div>} />
                  </div>
          </div>)
        }
        </div>
      </div>
     </div>
    </>
  )
}

export default Auctions
