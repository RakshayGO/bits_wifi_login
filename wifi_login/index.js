var content = document.getElementById("content");
var form = document.getElementById("form");
const INVALID_LOGIN =
  "<?xml version='1.0' ?><requestresponse><status><![CDATA[LOGIN]]></status><message><![CDATA[Login failed. Invalid user name/password. Please contact the administrator. ]]></message><logoutmessage><![CDATA[You have successfully logged off]]></logoutmessage><state><![CDATA[]]></state></requestresponse>";

let username, password, credentials;

const loginAPICall = async (username, password) => {
  return fetch("https://fw.bits-pilani.ac.in:8090/login.xml", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: "https://fw.bits-pilani.ac.in:8090",
      Referer: "https://fw.bits-pilani.ac.in:8090/httpclient.html",
      "Sec-Fetch-Site": "same-origin",
    },
    body: `mode=191&username=${username}&password=${password}&a=1677355712667&producttype=0`,
  })
    .then((resp) => {
      return resp.text();
    })
    .then((resp) => {
      if (resp.trim() === INVALID_LOGIN.trim())
        throw new Error("Invalid login/password");
    });
};

if (localStorage?.getItem("bits_wifi_credentials")) {
  credentials = JSON.parse(localStorage.getItem("bits_wifi_credentials"));
  username = credentials?.username;
  password = credentials?.password;
  content.innerHTML = "<div>Credentials available, logging in</div>";
  loginAPICall(username, password)
    .then((resp) => {
      content.innerHTML =
        "<div style='color:green; font-weight: bold; text-align: center'>Logged in</div>";
    })
    .catch((error) => {
      content.innerHTML = `<div style='color:red;'>${error.message}</div>`;
    });
} else {
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    credentials = {
      username: username,
      password: password,
    };

    loginAPICall(username, password)
      .then((resp) => {
        content.innerHTML =
          "<div style='color:green; font-weight: bold; text-align: center'>Logged in</div>";
        localStorage.setItem(
          "bits_wifi_credentials",
          JSON.stringify(credentials)
        );
      })
      .catch((error) => {
        form.innerHTML += `<div style='color:red; font-size:14px;'>${error.message}</div>`;
      });
  });
}
