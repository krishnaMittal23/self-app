// app/api/verify/route.ts
import { NextResponse } from "next/server";
import { SelfBackendVerifier, AllIds, DefaultConfigStore } from "@selfxyz/core";

// Reuse a single verifier instance
const selfBackendVerifier = new SelfBackendVerifier(
  process.env.SELF_SCOPE || "self-auth-demo",
  process.env.SELF_ENDPOINT || "https://your-app.ngrok.io/api/verify",
  false, // mockPassport: false = mainnet, true = staging/testnet
  AllIds,
  new DefaultConfigStore({
    minimumAge: 18,
    excludedCountries: [], // Add country codes to exclude if needed: ["IRN", "PRK", "RUS", "SYR"]
    ofac: false, // Set to true to enable OFAC sanctions list checking
  }),
  "uuid" // userIdentifierType
);

export async function POST(req: Request) {
  try {
    console.log("Verification request received");
    
    // Extract data from the request
    const { attestationId, proof, publicSignals, userContextData } = await req.json();
    
    console.log("Request data:", {
      attestationId: attestationId ? "present" : "missing",
      proof: proof ? "present" : "missing", 
      publicSignals: publicSignals ? "present" : "missing",
      userContextData: userContextData ? "present" : "missing"
    });

    // Verify all required fields are present
    if (!proof || !publicSignals || !attestationId || !userContextData) {
      console.log("Missing required fields");
      return NextResponse.json(
        {
          status: "error",
          result: false,
          message: "Proof, publicSignals, attestationId and userContextData are required",
          error_code: "MISSING_FIELDS"
        },
        { status: 400 }
      );
    }

    console.log("Starting verification process...");

    // Verify the proof
    const result = await selfBackendVerifier.verify(
      attestationId,    // Document type (1 = passport, 2 = EU ID card, 3 = Aadhaar)
      proof,            // The zero-knowledge proof
      publicSignals,    // Public signals array
      userContextData   // User context data (hex string)
    );

    console.log("Verification result:", {
      isValid: result.isValidDetails.isValid,
      hasOutput: !!result.discloseOutput
    });

    // Check if verification was successful
    if (result.isValidDetails.isValid) {
      // Verification successful - process the result
      console.log("Verification successful!");
      return NextResponse.json({
        status: "success",
        result: true,
        message: "Identity verification successful",
        credentialSubject: result.discloseOutput,
        timestamp: new Date().toISOString()
      });
    } else {
      // Verification failed
      console.log("Verification failed:", result.isValidDetails);
      return NextResponse.json(
        {
          status: "error",
          result: false,
          reason: "Verification failed",
          error_code: "VERIFICATION_FAILED",
          details: result.isValidDetails,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        status: "error",
        result: false,
        reason: error instanceof Error ? error.message : "Unknown error occurred",
        error_code: "UNKNOWN_ERROR"
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}