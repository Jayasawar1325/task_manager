/* eslint-disable no-undef */
import arcjet, { validateEmail } from "@arcjet/node";
const aj = arcjet({
    key: process.env.ARCJET_KEY, // Set your Arcjet key in .env file
    rules: [
      validateEmail({
        mode: "LIVE", // Ensure this is set to LIVE to block requests
        deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"], // Blocks invalid/disposable emails
      }),
    ],
  });
export {aj}  