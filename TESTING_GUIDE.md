# ROSCA-Guard Integration - Testing Guide

## ✅ What's Been Integrated

Your self-app now includes the full ROSCA-Guard functionality integrated with Self Protocol verification!

### Features Added:
1. **Wallet Connection** - RainbowKit integration for connecting MetaMask, WalletConnect, etc.
2. **ROSCA Dashboard** - View and manage your savings circles
3. **Circle Creation** - Create new ROSCA circles with custom parameters
4. **KYC Verification** - Self Protocol integration for privacy-preserving verification
5. **Smart Contract Integration** - Connected to deployed contracts on Sepolia and Celo Alfajores

## 🧪 Step-by-Step Testing Instructions

### Step 1: Access the Application ✅
Your app is running at: **http://localhost:3000**

1. Open your browser and visit the homepage
2. You should see the new ROSCA-Guard interface with two main sections:
   - ROSCA Savings Circles
   - Self Protocol Verification

### Step 2: Connect Your Wallet
1. Click the **"Connect Wallet"** button in the top right
2. Choose your wallet (MetaMask recommended)
3. Connect to **Ethereum Sepolia Testnet** (Chain ID: 11155111)
4. Approve the connection

**How to Add Sepolia Testnet:**
- Network Name: Sepolia
- RPC URL: https://rpc.sepolia.org
- Chain ID: 11155111
- Currency Symbol: ETH
- Block Explorer: https://sepolia.etherscan.io

### Step 3: Get Test Tokens
You'll need Sepolia ETH for gas fees:
- Faucet 1: https://sepoliafaucet.com/
- Faucet 2: https://www.alchemy.com/faucets/ethereum-sepolia

### Step 4: Complete KYC Verification
1. Click **"Get Verified"** on the homepage (or navigate to `/verification`)
2. Download the **Self App** from your mobile app store
3. Complete identity verification in the Self app
4. Scan the QR code displayed on the verification page
5. Follow the prompts in the Self app
6. Wait for verification confirmation

### Step 5: Browse ROSCA Circles
1. After connecting wallet, click **"Browse ROSCA Circles"**
2. You'll see the ROSCA Dashboard showing:
   - Your verification status
   - Your joined circles
   - Available circles by country
3. Use the country dropdown to filter circles

### Step 6: Create a ROSCA Circle
1. On the dashboard, click **"Create Circle"**
2. Fill in the form:
   - **Monthly Amount**: e.g., 100 PYUSD
   - **Max Members**: e.g., 10 people
   - **Duration**: e.g., 12 months
   - **Country**: Select from dropdown
   - **Age Range**: e.g., 18-65
3. Review the circle summary
4. Click **"Create Circle"**
5. Confirm the transaction in your wallet
6. Wait for confirmation

### Step 7: Join a Circle
1. From the dashboard, browse available circles
2. Click **"Join Circle"** on a circle you want to join
3. The system will automatically check your eligibility:
   - Are you KYC verified?
   - Does your nationality match?
   - Is your age within range?
4. If eligible, confirm the transaction
5. You'll be added to the circle!

## 📋 Test Scenarios

### Scenario A: Full User Journey (Recommended)
1. ✅ Start app (http://localhost:3000)
2. Connect wallet to Sepolia testnet
3. Complete Self Protocol verification
4. Create a new ROSCA circle
5. View your circle in "My Circles"
6. Browse other available circles
7. Join another circle (if eligible)

### Scenario B: Browse Without Verification
1. Connect wallet
2. Navigate to ROSCA dashboard
3. You'll see a "Not Verified" warning
4. You can browse circles but cannot join them
5. Click "Verify Now" to start verification

### Scenario C: Test Different Countries
1. Create circles for different countries (USA, IND, GBR, etc.)
2. Switch the country filter on the dashboard
3. Observe how circles are organized by region

## 🔍 What to Verify

### ✅ Homepage
- [ ] ROSCA Guard header with wallet connect button
- [ ] Two main feature cards (ROSCA + Self Protocol)
- [ ] "How It Works" section with 3 steps
- [ ] Requirements section at bottom

### ✅ Verification Page
- [ ] QR code displays correctly
- [ ] Instructions are clear
- [ ] Verification status updates after scanning
- [ ] Success message appears after verification

### ✅ ROSCA Dashboard
- [ ] Wallet connection status shown
- [ ] Verification badge (green if verified, yellow if not)
- [ ] "My Circles" section loads
- [ ] "Available Circles" section with country filter
- [ ] "Create Circle" button navigates correctly

### ✅ Create Circle Page
- [ ] All form fields work correctly
- [ ] Circle summary updates as you type
- [ ] Form validation works
- [ ] Transaction submits successfully
- [ ] Redirects to dashboard after creation

## 🔧 Troubleshooting

### Issue: "Service not initialized" error
**Solution**: Make sure MetaMask or another Web3 wallet is installed and connected

### Issue: Transaction fails
**Solution**: 
- Check you have enough Sepolia ETH for gas
- Verify you're on the correct network (Sepolia, not mainnet)
- Try increasing gas limit in MetaMask settings

### Issue: Verification not working
**Solution**:
- Ensure Self app is installed on your mobile device
- Check that your phone has internet connection
- Make sure the QR code is fully visible
- Try regenerating the QR code

### Issue: Cannot see circles
**Solution**:
- Make sure you're connected to Sepolia testnet
- Check that the contracts are deployed (addresses in `contractAddresses.ts`)
- Try refreshing the page

## 📱 Contract Addresses

### Ethereum Sepolia Testnet
- ROSCA Factory: `0x9F01d0beE74AC0aF15a390cF5bd54E28EF4BbBac`
- ROSCA Analytics: `0x45Fdf95185922b91627F0B340AFA3DF0fED650E7`
- Mock PYUSD: `0x1e4e7e50E176A66BBEFC61331898F5ffdE49DBd6`
- Block Explorer: https://sepolia.etherscan.io

### Celo Alfajores Testnet
- KYC Verifier: `0xAE8d27497451A252815B86898CDAd029be1417e9`
- Block Explorer: https://alfajores.celoscan.io

## 🎯 Next Steps for Production

1. **Deploy to Production**:
   - Update RPC URLs in `contractAddresses.ts`
   - Deploy contracts to mainnet
   - Update environment variables

2. **Get Real PYUSD**:
   - Integrate with PayPal for PYUSD
   - Add fiat on-ramp functionality

3. **Enhanced Features**:
   - Add payment reminders
   - Implement payout rotation logic
   - Add dispute resolution
   - Create mobile app
   - Add notifications

4. **Security Audits**:
   - Audit smart contracts
   - Penetration testing
   - Security best practices review

## 🚀 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for linting errors
npm run lint
```

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors (F12)
2. Review the terminal output
3. Check MetaMask for pending transactions
4. Verify network settings

---

**Current Status**: ✅ All core features integrated and working!
**App URL**: http://localhost:3000
**Test Network**: Ethereum Sepolia (Chain ID: 11155111)
