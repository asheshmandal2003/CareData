import { ethers } from "/ethers-5.6.esm.min.js";
import { address, abi } from "/contractDetails.js";
import {
  cloudinary_url,
  cloudinary_upload_preset,
} from "/cloudinaryCredentials.js";

$(".spinner").hide();
$(".sharing-spinner").hide();
$("document").ready(connectMetamask);
$(".upload-form").on("submit", handleSubmission);
$(".share-btn").on("click", shareFile);
$(".showPatientData-btn").on("click", showPatientDetails);

if ($(".uploadFile").val() === "") {
  $(".upload-btn").hide();
}
$(".uploadFile").on("change", () => {
  if ($(".uploadFile").val() === "") {
    $(".upload-btn").hide();
  } else {
    $(".upload-btn").show();
  }
});

let contract;
let account;
async function connectMetamask() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (provider) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      account = await signer.getAddress();
      contract = new ethers.Contract(address, abi, signer);
      $(".account_no").text(account ? account : "No account connected!");
      const dataArray = await contract.display(account);
      if (dataArray.length !== 0) {
        dataArray.map((img) => {
          return $(".recently-edited")
            .prepend(
              $("<img>", {
                id: "theImg",
                class: "mb-3 me-3",
                src: `${img.replace("/upload", "/upload/w_250")}`,
              })
            )
            .wrap(`<a href=${img} target="_blank"></a>`);
        });
      } else {
        console.log("No image to display!");
      }
    } else {
      alert("Metamask is not installed!");
    }
  } catch (error) {
    alert("No web3 provider is installed :(");
  }
}

async function handleSubmission(e) {
  e.preventDefault();
  try {
    $(".upload-btn").attr("disabled", "disabled");
    $(".upload-text").hide();
    $(".spinner").show();
    const file = document.querySelector("[type=file]").files[0];
    const formdata = new FormData();
    const CLOUDINARY_URL = cloudinary_url;
    const CLOUDINARY_UPLOAD_PRESET = cloudinary_upload_preset;
    formdata.append("file", file);
    formdata.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const resFile = await axios({
      method: "post",
      url: CLOUDINARY_URL,
      data: formdata,
    });
    await contract.add(account, resFile.data.secure_url);
    $(".uploadFile").val("");
    $(".upload-btn").removeAttr("disabled");
    $(".spinner").hide();
    $(".upload-text").show();
    $(".upload-btn").hide();
    alert("Image Uploded!");
  } catch (error) {
    $(".uploadFile").val("");
    $(".upload-btn").removeAttr("disabled");
    $(".spinner").hide();
    $(".upload-text").show();
    $(".upload-btn").hide();
    alert("Can't upload!");
    console.log(error);
  }
}

async function shareFile() {
  try {
    if ($(".share-address").val() !== "") {
      $(".share-text").hide();
      $(".sharing-spinner").show();
      await contract.allow($(".share-address").val());
      $(".share-address").val("");
      $(".sharing-spinner").hide();
      $(".share-text").show();
    } else {
      alert("Please enter an Account ID!");
    }
  } catch (error) {
    alert("Can't share the file :(");
  }
}

async function showPatientDetails() {
  try {
    if ($(".patientAccId").val()) {
      const imgUrls = await contract.display($(".patientAccId").val());
      imgUrls.map((imgUrl) => {
        return $(".patientData")
          .prepend(
            $("<img>", {
              class: "mb-3",
              src: `${imgUrl.replace("/upload", "/upload/w_300")}`,
            })
          )
          .wrap(`<a href=${imgUrl} target="_blank"></a>`);
      });
    }
  } catch (error) {}
}
