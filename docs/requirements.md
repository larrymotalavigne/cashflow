# CashflowGame Requirements

## Overview
CashflowGame is a financial simulation game designed to teach players about personal finance, investing, and achieving financial freedom. The game simulates a player's financial journey from having a job with regular income and expenses to achieving financial independence through investments and passive income.

## Core Game Mechanics

### 1. Player Profile
- Players start with a selected job that determines their income and expenses
- Players have an age that increases with each turn
- Players have a name (can be randomly generated or user-selected)
- Players track their cash, income, expenses, and passive income

### 2. Game Progression
- The game progresses in turns, with each turn representing a financial period
- Each turn, players receive their income, pay expenses, and can make investment decisions
- Random events occur each turn that can affect the player's finances
- The game continues until the player achieves financial freedom

### 3. Financial Freedom Goal
- The primary goal is to achieve financial freedom
- Financial freedom is defined as having passive income exceed expenses
- Players must make strategic investment decisions to increase passive income

## Key Features

### 1. Job Selection
- Players can choose from a variety of jobs with different salary ranges and expenses
- Jobs include various professions (e.g., Farmer, Lawyer, Developer, Teacher)
- Each job has a minimum and maximum salary range
- Each job has associated living expenses

### 2. Investment System
- Players can purchase various types of investments:
  - Real estate (apartments, houses, commercial properties)
  - Business investments
  - Stock market investments (ETFs, index funds)
  - Funds (crowdfunding, private equity)
  - Cryptocurrency
- Each investment has:
  - A purchase cost (amount)
  - Passive income generation
  - Investment type classification

### 3. Loan System
- Players can take loans to purchase investments they cannot afford
- Loans have an interest rate (default 10%)
- Loans create ongoing yearly payments that reduce cash flow

### 4. Random Events
- Each turn, players encounter random events that affect their finances
- Events can be positive (bonuses, lottery wins, inheritance) or negative (repairs, taxes, medical expenses)
- Events can affect either cash directly or ongoing expenses

## User Interface Requirements

### 1. Startup Screen
- Allow players to select a job
- Allow players to enter or generate a name
- Allow players to set their starting age
- Display starting money based on job selection

### 2. Main Game Screen
- Display player information (name, age, job)
- Display financial information (cash, income, expenses, passive income)
- Show investment opportunities
- Show random events
- Provide controls for advancing to the next turn

### 3. Investment Dialog
- Display available investments
- Show investment details (cost, income generation)
- Provide options to purchase with cash or loan
- Show whether player can afford each investment

### 4. Progress Tracking
- Display progress toward financial freedom
- Show history of investments and financial decisions
- Display current passive income vs. expenses ratio

## Technical Requirements

### 1. Data Management
- Store player profile and game state
- Manage a database of jobs, investments, and random events
- Track player's investment portfolio

### 2. Game Logic
- Calculate income, expenses, and passive income each turn
- Determine random events and investment opportunities
- Check for win condition (passive income > expenses)
- Handle loan calculations and payments

### 3. User Interface
- Responsive design for different screen sizes
- Intuitive controls for game actions
- Clear visualization of financial data
- Engaging presentation of game events

## Future Enhancements

### 1. Advanced Features
- Multiple difficulty levels
- More complex investment options with risk factors
- Economic cycles that affect investment returns
- Multiplayer mode for competition

### 2. Educational Components
- Financial tips and learning resources
- Explanations of investment concepts
- Real-world financial principles integration

### 3. Customization
- Custom job creation
- Personalized investment strategies
- Scenario-based challenges