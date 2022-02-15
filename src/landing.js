import React, { useState } from 'react'
import TextLoop from 'react-text-loop'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import bg from './images/background.jpg'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()
  const OnClick = () => {
    navigate('/luckdraw')
  }
  return (
    <div>
      <img
        src={bg}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
        onClick={() => {
          OnClick()
        }}
      ></img>
    </div>
  )
}

export default Landing
