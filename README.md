# CareData

CareData is a blockchain-based decentralized web application where patients can store their medical records securely and access them easily. We are also providing many other features, like booking appointments with doctors online, online video consultations with doctors, booking appointments for lab tests, and a medical blog page that will instruct patients on how to stay healthy.
Here we are using the Ethereum blockchain, and every smart contract is written on Solidity. For the frontend part, we are using EJS and Bootstrap, and for the backend part, Node.js and Express.js are used. For the database part, we are using MongoDB, and we are using EtherJS for connecting the web 2.0 part with blockchain.

## Prerequisites

- Make sure that you have already installed Node.js Shell and MongoDB Compass.
- Create a `.env` file and initialize your `PORT` and `SESSION_SECRET`.
- Set up your cloudinary account and store your cloudinary credentials in the `.env` file.
- Create a file named `ethers-5.6.esm.min.js` in the public folder, then follow the link [ether js installation](https://cdn.ethers.io/lib/ethers-5.1.esm.min.js), copy everything from that page, and paste it on that file.
- Enable your cloudinary account's unsigned uploading. Because our blockchain part doesn't have any backend parts, we have to store our files on the frontend part. [To do this, please follow this article.](https://medium.com/@aalam-info-solutions-llp/how-to-upload-images-to-cloudinary-with-react-js-ad402f775818)
- Create a file named `cloudinaryCredentials.js` in the public folder and make two constant variables called `cloudinary_url` and `cloudinary_upload_preset` and export them.

Now your local environment is ready to run the project.

## Installation

```
cd caredata
npm install
node index.js
```

After that, check the console where your application is running, open a browser, and write,
`http://localhost:PORT/caredata`

## Usage

For getting those Web 3.0 features Metamask should be installed in your browser. If it is, then go to the file upload page, and you will see Metamask pop up to connect it with the application. Connect it with your application, and then you can upload your files. Remember, you need to have some test ethers for the transactions. If you don't have one, then change your metamask network to Sepolia Network and then go to [Sepolia Faucet](https://sepoliafaucet.com/) and collect your free Sepolia test ethers. (To get free ethers from the Sepolia faucet, you have to sign up on alchemy.) Now you are ready to use those features.

## Credits

- [Ashesh Mandal](https://github.com/asheshmandal2003)
- [Devayan Mandal](https://github.com/devayanm)
