import { ethers, BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ADDRESSES, DEFAULT_NETWORK } from '../contracts/contractAddresses';
import ROSCAFactoryABI from '../contracts/ROSCAFactory.json';
import KYCVerifierABI from '../contracts/KYCVerifier.json';

export interface CircleInfo {
  circleAddress: string;
  monthlyAmount: bigint;
  maxMembers: bigint;
  currentMembers: bigint;
  country: string;
  minAge: bigint;
  maxAge: bigint;
  isActive: boolean;
}

export interface CreateCircleParams {
  monthlyAmount: string; // in PYUSD
  maxMembers: number;
  duration: number; // in months
  country: string;
  minAge: number;
  maxAge: number;
}

export interface VerificationDetails {
  isVerified: boolean;
  nationality: string;
  ageAtVerification: bigint;
  verificationTimestamp: bigint;
  isHuman: boolean;
  passedOFACCheck: boolean;
}

export class ROSCAService {
  private provider: BrowserProvider | null = null;
  private factoryContract: Contract | null = null;
  private kycContract: Contract | null = null;

  async initialize(provider: any) {
    this.provider = new BrowserProvider(provider);
    const signer = await this.provider.getSigner();
    
    // Initialize ROSCA Factory contract
    const factoryAddress = CONTRACT_ADDRESSES[DEFAULT_NETWORK].ROSCA_FACTORY;
    this.factoryContract = new Contract(factoryAddress, ROSCAFactoryABI, signer);

    // Initialize KYC Verifier contract (on Celo Alfajores)
    const kycAddress = CONTRACT_ADDRESSES.CELO_ALFAJORES.KYC_VERIFIER;
    this.kycContract = new Contract(kycAddress, KYCVerifierABI, signer);
  }

  async createCircle(params: CreateCircleParams): Promise<{
    circleId: bigint;
    transactionHash: string;
  }> {
    if (!this.factoryContract) {
      throw new Error('Service not initialized. Call initialize() first.');
    }

    try {
      // Convert monthly amount to PYUSD (6 decimals)
      const monthlyAmountWei = ethers.parseUnits(params.monthlyAmount, 6);

      const tx = await this.factoryContract.createCircle(
        monthlyAmountWei,
        params.maxMembers,
        params.duration,
        params.country,
        params.minAge,
        params.maxAge
      );

      const receipt = await tx.wait();
      
      // Find the CircleCreated event to get the circle ID
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.factoryContract!.interface.parseLog(log);
          return parsed?.name === 'CircleCreated';
        } catch {
          return false;
        }
      });

      let circleId = BigInt(0);
      if (event) {
        const parsed = this.factoryContract.interface.parseLog(event);
        circleId = parsed!.args[0];
      }

      return {
        circleId,
        transactionHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error creating circle:', error);
      throw new Error(`Failed to create circle: ${error.message}`);
    }
  }

  async joinCircle(circleId: number): Promise<string> {
    if (!this.factoryContract) {
      throw new Error('Service not initialized');
    }

    try {
      const tx = await this.factoryContract.joinCircle(circleId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error joining circle:', error);
      throw new Error(`Failed to join circle: ${error.message}`);
    }
  }

  async getCircleInfo(circleId: number): Promise<CircleInfo> {
    if (!this.factoryContract) {
      throw new Error('Service not initialized');
    }

    try {
      const info = await this.factoryContract.getCircleInfo(circleId);
      return {
        circleAddress: info[0],
        monthlyAmount: info[1],
        maxMembers: info[2],
        currentMembers: info[3],
        country: info[4],
        minAge: info[5],
        maxAge: info[6],
        isActive: info[7]
      };
    } catch (error: any) {
      console.error('Error fetching circle info:', error);
      throw new Error(`Failed to fetch circle info: ${error.message}`);
    }
  }

  async getCirclesByCountry(country: string): Promise<number[]> {
    if (!this.factoryContract) {
      throw new Error('Service not initialized');
    }

    try {
      const circles = await this.factoryContract.getCirclesByCountry(country);
      return circles.map((id: bigint) => Number(id));
    } catch (error: any) {
      console.error('Error fetching circles by country:', error);
      return [];
    }
  }

  async getUserCircles(userAddress: string): Promise<number[]> {
    if (!this.factoryContract) {
      throw new Error('Service not initialized');
    }

    try {
      const circles = await this.factoryContract.getUserCircles(userAddress);
      return circles.map((id: bigint) => Number(id));
    } catch (error: any) {
      console.error('Error fetching user circles:', error);
      return [];
    }
  }

  async getTotalCircles(): Promise<number> {
    if (!this.factoryContract) {
      throw new Error('Service not initialized');
    }

    try {
      const total = await this.factoryContract.totalCircles();
      return Number(total);
    } catch (error: any) {
      console.error('Error fetching total circles:', error);
      return 0;
    }
  }

  async isUserVerified(userAddress: string): Promise<boolean> {
    if (!this.kycContract) {
      throw new Error('Service not initialized');
    }

    try {
      return await this.kycContract.isUserVerified(userAddress);
    } catch (error: any) {
      console.error('Error checking verification status:', error);
      return false;
    }
  }

  async getUserVerificationDetails(userAddress: string): Promise<VerificationDetails> {
    if (!this.kycContract) {
      throw new Error('Service not initialized');
    }

    try {
      const details = await this.kycContract.getUserVerificationDetails(userAddress);
      return {
        isVerified: details[0],
        nationality: details[1],
        ageAtVerification: details[2],
        verificationTimestamp: details[3],
        isHuman: details[4],
        passedOFACCheck: details[5]
      };
    } catch (error: any) {
      console.error('Error fetching verification details:', error);
      throw new Error(`Failed to fetch verification details: ${error.message}`);
    }
  }

  async checkEligibility(
    userAddress: string,
    requiredCountry: string,
    minAge: number,
    maxAge: number
  ): Promise<{ eligible: boolean; reason: string }> {
    if (!this.kycContract) {
      throw new Error('Service not initialized');
    }

    try {
      const result = await this.kycContract.isEligibleForROSCA(
        userAddress,
        requiredCountry,
        minAge,
        maxAge
      );
      return {
        eligible: result[0],
        reason: result[1]
      };
    } catch (error: any) {
      console.error('Error checking eligibility:', error);
      return {
        eligible: false,
        reason: 'Error checking eligibility'
      };
    }
  }

  formatPYUSD(amount: bigint): string {
    return ethers.formatUnits(amount, 6);
  }

  parsePYUSD(amount: string): bigint {
    return ethers.parseUnits(amount, 6);
  }
}

export const roscaService = new ROSCAService();
