import { ethers } from "/ethers-5.6.esm.min.js";
import { address, abi } from "/contractDetails.js";
// import axios from "axios";
// import multer from "multer";
// import { storage } from "../../clodinary/index";

// const upload = multer({ storage });

// $(".connect").on("click", connectMetamask);
$("document").ready(connectMetamask);
$(".upload-form").on("submit", handleSubmission);

let contract;
let account;
async function connectMetamask() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  if (provider) {
    window.ethereum.on("accountsChanged", () => window.location.reload());
    window.ethereum.on("chainChanged", () => window.location.reload());
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    account = await signer.getAddress();
    console.log(account);
    contract = new ethers.Contract(address, abi, signer);
    $(".account_no").text(account);
    const dataArray = await contract.display(account);
    if (dataArray.length !== 0) {
      const imageLink = dataArray.toString();
      const imageLinkArray = imageLink.split(",");
      imageLinkArray.map((img) => {
        return $(".img-list").prepend(
          $("<img>", {
            id: "theImg",
            src: `https://gateway.pinata.cloud/ipfs/${img.substring(6)}`,
          })
        );
      });
    } else {
      console.log("No image to display!");
    }
  } else {
    alert("Metamask is not installed!");
  }
}

async function handleSubmission(e) {
  e.preventDefault();
  try {
    const file = document.querySelector("[type=file]").files[0];
    const formdata = new FormData();
    formdata.append("file", file);
    console.log(file);
    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formdata,
      headers: {
        pinata_api_key: "c1ee07266e75c299f75a",
        pinata_secret_api_key:
          "dee217afd277445c89b860052791e41735b87b1df3e5c3566cb9ae866675d2f4",
        "Content-Type": "multipart/form-data",
      },
    });
    const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
    await contract.add(account, ImgHash);
    alert("Image Uploaded Successfully :)");
  } catch (error) {
    alert("Can't upload!");
    console.log(error);
  }
}
