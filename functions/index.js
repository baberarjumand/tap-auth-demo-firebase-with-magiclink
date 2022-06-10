// For firebase service account credentials, create a 'firebase-service-account.js' file.
// Then paste the following code into it (with your actual credentials from Firebase console):

// exports.firebaseCreds = {
//   type: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//   project_id: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//   private_key_id: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//   private_key:
//     "-----BEGIN PRIVATE KEY-----\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx\n-----END PRIVATE KEY-----\n",
//   client_email: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx",
//   client_id: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
// };

const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const serviceAccount = require("./firebase-service-account").firebaseCreds;
const serviceAccount = require("./firebase-service-account.json");
// const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  //   functions.logger.info("Hello logs!", { structuredData: true });

  response.set("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");

  response.status(200).send({
    data: {
      helloText: "Hello from Firebase!",
    },
  });
});

const handleExistingUser = async (user, claim) => {
  /* Check for replay attack (https://go.magic.link/replay-attack) */
  let lastSignInTime = Date.parse(user.metadata.lastSignInTime) / 1000;
  let tokenIssuedTime = claim.iat;
  if (tokenIssuedTime <= lastSignInTime) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "This DID token is invalid."
    );
  }
  let firebaseToken = await admin.auth().createCustomToken(user.uid);
  return {
    uid: user.uid,
    token: firebaseToken,
  };
};

const handleNewUser = async (email) => {
  const newUser = await admin.auth().createUser({
    email: email,
    emailVerified: true,
  });
  let firebaseToken = await admin.auth().createCustomToken(newUser.uid);
  return {
    uid: newUser.uid,
    token: firebaseToken,
  };
};

exports.getFirebaseUserAccessToken = functions.https.onCall(
  async (data, context) => {
    const { Magic } = require("@magic-sdk/admin");
    const magic = new Magic(process.env.MAGIC_SECRET_API_KEY);
    const didToken = data.didToken;
    const metadata = await magic.users.getMetadataByToken(didToken);
    const email = metadata.email;
    try {
      /* Get existing user by email address,
         compatible with legacy Firebase email users */
      let user = (await admin.auth().getUserByEmail(email)).toJSON();
      const claim = magic.token.decode(didToken)[1];
      return await handleExistingUser(user, claim);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        /* Create new user */
        return await handleNewUser(email);
      } else {
        throw err;
      }
    }
  }
);
