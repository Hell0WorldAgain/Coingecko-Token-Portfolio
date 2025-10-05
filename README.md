# Coingecko Token Portfolio

A modern, real-time cryptocurrency portfolio tracker built with React, TypeScript, Redux, and Vite.

![React](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Redux](https://img.shields.io/badge/Redux-5.0-purple) ![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)

## Features

-  **Real-time Portfolio Tracking** - Auto-updating prices with configurable intervals (10s-5m)
-  **Interactive Watchlist** - Add/remove tokens, edit holdings, view 7-day sparklines
-  **Live Price Updates** - CoinGecko API integration with rate-limit protection
-  **Beautiful UI** - Dark theme, responsive design, smooth animations
-  **Data Persistence** - Redux + LocalStorage for state management
-  **Wallet Connect** - Mock wallet integration (ready for Web3)

## Quick Start

### Clone repository
git clone https://github.com/Hell0WorldAgain/Coingecko-Token-Portfolio.git
cd Coingecko-Token-Portfolio

### Install dependencies
npm install

### Start development server
npm run dev

### Build for production
npm run build

## Project Structure
```bash
src/
├── components/          # React components (Portfolio, Modal, Chart, etc.)
├── store/              # Redux store, actions, reducers
├── services/           # CoinGecko API integration
├── types/              # TypeScript definitions
├── App.tsx             # Main app
└── index.css           # Global styles

```

## Tech Stack

- React 18 - UI library
- TypeScript - Type safety
- Redux - State management
- Vite - Build tool
- CoinGecko API - Crypto data (free tier: 10-30 calls/min)
<br/><br/>
<div align="center">
Built with ❤️ by <a href="https://www.linkedin.com/in/abhishek-ch0udhary/">Abhishek</a> <br/>
<a href ="https://coingecko-token-portfolio.vercel.app/"> Demo </a>
</div>
