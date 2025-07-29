const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

let myVideoStream;

const peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: location.port || (location.protocol === "https:" ? 443 : 80),
  config: {
    iceServers: [
      { urls: "stun:stun01.sipphone.com" },
      { urls: "stun:stun.ekiga.net" },
      { urls: "stun:stunserver.org" },
      { urls: "stun:stun.softjoys.com" },
      { urls: "stun:stun.voiparound.com" },
      { urls: "stun:stun.voipbuster.com" },
      { urls: "stun:stun.voipstunt.com" },
      { urls: "stun:stun.voxgratia.org" },
      { urls: "stun:stun.xten.com" },
      {
        urls: "turn:192.158.29.39:3478?transport=udp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808",
      },
      {
        urls: "turn:192.158.29.39:3478?transport=tcp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808",
      },
    ],
  },
  debug: 3,
});

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  })
  .catch((err) => {
    alert("Failed to access camera and microphone. Please allow access.");
    console.error(err);
  });

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
};

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, user);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const text = document.querySelector("#chat_message");
const send = document.getElementById("send");
const messages = document.querySelector(".messages");

send.addEventListener("click", () => {
  if (text.value.trim() !== "") {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.trim() !== "") {
    socket.emit("message", text.value);
    text.value = "";
  }
});

socket.on("createMessage", (message, userName) => {
  const isMe = userName === user;
  messages.innerHTML += `
    <div class="message">
      <b><span class="material-icons">account_circle</span> <span>${
        isMe ? "me" : userName
      }</span></b>
      <span>${message}</span>
    </div>
  `;
  messages.scrollTop = messages.scrollHeight;
});

const muteButton = document.getElementById("muteButton");
muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    muteButton.classList.add("background__red");
    muteButton.innerHTML = `<span class="material-icons">mic_off</span>`;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    muteButton.classList.remove("background__red");
    muteButton.innerHTML = `<span class="material-icons">mic</span>`;
  }
});

const stopVideo = document.getElementById("stopVideo");
stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    stopVideo.classList.add("background__red");
    stopVideo.innerHTML = `<span class="material-icons">videocam_off</span>`;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    stopVideo.classList.remove("background__red");
    stopVideo.innerHTML = `<span class="material-icons">videocam</span>`;
  }
});

const inviteButton = document.getElementById("inviteButton");
inviteButton.addEventListener("click", () => {
  prompt(
    "Copy this link and send it to people you want to meet with:",
    window.location.href
  );
});

const endMeetingButton = document.getElementById("endMeeting");
endMeetingButton.addEventListener("click", () => {
  socket.emit("end-meeting", ROOM_ID);
  window.location.href = "/caredata";
});

socket.on("meeting-ended", () => {
  alert("Meeting has ended. Thank you for joining!");
  window.location.href = "/caredata";
});

$(".header__back").on("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

$("#showChat").on("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});
