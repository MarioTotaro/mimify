import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  publicKey,
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  publicKey as publicKeySerializer,
  string,
  base58,
} from "@metaplex-foundation/umi/serializers";
import { readFile } from "fs/promises";
import {
  createIrysUploader,
  irysUploader,
} from "@metaplex-foundation/umi-uploader-irys";
import pkg from "@metaplex-foundation/mpl-token-metadata";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";

const {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionArgs,
  CreateMetadataAccountV3InstructionAccounts,
  DataV2Args,
  MPL_TOKEN_METADATA_PROGRAM_ID,
  createNft,
  mplTokenMetadata,
} = pkg;

// Helper function to load JSON files
async function loadJson(filePath) {
  const data = await fs.promises.readFile(filePath, "utf8");
  return JSON.parse(data);
}

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load wallet.json
const wallet = await loadJson(path.join(__dirname, "./wallet.json"));

const umi = createUmi("https://api.devnet.solana.com", "finalized");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

const metadata = {
  name: "MasterZ NFT",
  symbol: "MZT",
  description: "NFT di esempio per il corso di Blockchain MasterZ",
  image: "https://arweave.net/h-DGKuyHe3NOP_kkuAHl-R3_WBn7RVF5qDeHtmebAXw",
  attributes: [
    {
      trait_type: "Rarity",
      value: "Common",
    },
    {
      trait_type: "Author",
      value: "MasterZ",
    },
  ],
  proprieties: {
    files: [
      {
        type: "image/jpeg",
        uri: "https://arweave.net/9AXtb2s4JBRoQ_y95OUwUTp5rKCMs4w1IYbPhoJOypg",
      },
    ],
  },
};

let isLogged = false;
let walletAddress = "";
let nftSupply = 1000;

// Configure Passport.js
passport.use(
  "local",
  new LocalStrategy((username, password, done) => {
    const user = { id: 1, username: "test" };
    isLogged = true;
    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  console.log(req.isAuthenticated());
  res.render("index", {
    isLogged: isLogged,
    walletAddress: (walletAddress != "" ? walletAddress.slice(0, 12) + "..." : null),
  });
});

app.post("/login", function (req, res) {
  isLogged = true;
  walletAddress = "8tzG2sZrdQf5Nqqz4YnngkSQi2hFHwB5qEKFch2J23ZA";

  res.redirect("/event-creator-form");
  /*passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
  */

});

app.get("/event-creator-form", (req, res) => {
  /*if (!req.isAuthenticated()) {
    return res.redirect("/");
  }*/
  res.render("event-creator-form.ejs", {
    isLogged : isLogged,
    walletAddress: (walletAddress != "" ? walletAddress.slice(0, 12) + "..." : null),
  });
});

app.post("/upload", async (req, res) => {
  // if (!req.isAuthenticated()) {
  //   return res.redirect("/");
  // }
  console.log("Received request at /upload");
  try {
    umi.use(irysUploader());
    umi.use(signerIdentity(myKeypairSigner));

    const image = await readFile(
      path.join(__dirname, "/public/assets/images/masterz-logo.jpg")
    );
    const nft_image = createGenericFile(image, "MasterZevent");
    const [myUri] = await umi.uploader.upload([nft_image]);

    console.log("Uri Nft Image: ", myUri);

    const nftUri = await umi.uploader.uploadJson(metadata);
    console.log("Nft Uri:", nftUri);

    const eventTitle = "MasterZ Event";

    res.render("sellerInterface.ejs", {
      eventTitle: eventTitle,
      nftSupply: nftSupply,
      nftSymbol: "MTZ",
      owner: "8tzG2sZrdQf5Nqqz4YnngkSQi2hFHwB5qEKFch2J23ZA",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while uploading the file" });
  }
});

app.get("/sellerInterface", (req, res) => {
  // if (!req.isAuthenticated()) {
  //   return res.redirect("/");
  // }
  const eventTitle = "MasterZ Event";
  res.render("sellerInterface.ejs", {
    eventTitle: eventTitle,
    nftSupply: nftSupply,
    nftSymbol: "MTZ",
    owner: "8tzG2sZrdQf5Nqqz4YnngkSQi2hFHwB5qEKFch2J23ZA",
  });
});

app.post("/mintNft", async (req, res) => {
  // if (!req.isAuthenticated()) {
  //   return res.redirect("/");
  // }
  console.log("inside /mintNft");
  umi.use(signerIdentity(myKeypairSigner)).use(mplTokenMetadata());
  const name = "MasterZ NFT";
  const uri = "https://arweave.net/fcsUfJJ-WMeL0-1TDDWkcbPlXTlJ9PrZ1E5LIeRBT4E";
  const mint = generateSigner(umi);
  const sellerFeeBasisPoints = percentAmount(5, 2);
  let tx = createNft(umi, {
    mint,
    name,
    uri,
    sellerFeeBasisPoints,
  });

  let result = await tx.sendAndConfirm(umi);
  const signature = base58.deserialize(result.signature);
  console.log(signature);
  res.render("sellerInterface.ejs", {
    eventTitle: "MasterZ Events",
    nftSupply: nftSupply - 1,
    nftSymbol: "MTZ",
    owner: "8tzG2sZrdQf5Nqqz4YnngkSQi2hFHwB5qEKFch2J23ZA",
    showModal: true // Indica che la modale deve essere mostrata
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
