import React from 'react';
import { Box } from '@mui/material';
import Home from '../home';
// import { useHistory } from "react-router-dom";


function HomeScreen() {
    // const history = useHistory();
    // const navigateTo = () => history.push('/Account');//eg.history.push('/login');
    return (
        <>

            <Box sx={{ flexGrow: 1 }}>
                <Home/>
            </Box>
        </>
    )
}

export default HomeScreen;