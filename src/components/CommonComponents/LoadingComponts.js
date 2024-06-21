import React from "react";
import {Backdrop, CircularProgress} from '@mui/material';

const LoadingComponent=({isLoading})=>{

    return <Backdrop
        sx={{ color: "var(--clr-black)",zIndex: (theme) => theme.zIndex.drawer + 10000 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
}
export default LoadingComponent;