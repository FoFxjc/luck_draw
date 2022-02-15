import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'

import App from './App'

import LuckDraw from './luck_draw'
import Landing from './landing'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/luckdraw" element={<LuckDraw />} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
  rootElement
)
