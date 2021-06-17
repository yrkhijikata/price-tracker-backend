require("dotenv").config();

const admin = require("firebase-admin");
let serviceAccount;

if (process.env.NODE_ENV === "development") {
  serviceAccount = require("./ServiceAccountKey.json");
} else {
  serviceAccount = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key: process.env.private_key.replace(/\\n/g, "\n"),
    private_key_id: process.env.private_key_id,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
  };
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://price-tracker-development-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.firestore();

module.exports = { db };
