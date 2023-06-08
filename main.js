showData();
var firstName = document.getElementById("userFirstName").value;
var lastName = document.getElementById("userLastName").value;
var contactNumber = document.getElementById("userNumber").value;

var video = document.querySelector("#videoElement");

navigator.getUserMedia, elem = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

console.log(navigator.getUserMedia);

if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true}, handleVideo, videoError);
}

function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
    // do something
}

function addData() {
  setTimeout(() => {
    location.reload();
  }, 2000);

  firstName = document.getElementById("userFirstName").value;
  lastName = document.getElementById("userLastName").value;
  contactNumber = document.getElementById("userNumber").value;

  fetch("https://average-fish-sundress.cyclic.app/addContact", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: contactNumber,
      profileImg: "https://picsum.photos/200/300",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  document.getElementById("userFirstName").value = "";
  document.getElementById("userLastName").value = "";
  document.getElementById("userNumber").value = "";
}

function showData() {
  fetch("https://average-fish-sundress.cyclic.app/allContacts", {
    method: "GET",
    headers: { "Content-type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var tableHead = document.getElementById("thead");
      var tableBody = document.getElementById("tbody");

      tableHead.innerHTML = `<tr>
                              <td>ProfileImg</td>
                              <td>FirstName</td>
                              <td>LastName</td>
                              <td>PhoneNumber</td>
                              <td>Operations</td>
                             </tr>`;

      for (let i = 0; i < data.length; i++) {
        var id = "647ce4913835b15b58a29fa5";
        console .log(id)
        var row = `<tr>
                        <td>${data[i].profileImg}</td>
                        <td>${data[i].firstName}</td>
                        <td>${data[i].lastName}</td>
                        <td>${data[i].phoneNumber}</td>
                        <td>
                        <button class = "btn btn-danger mx-2" onclick = "deleteContact(${id})">Delete</button>
                        <button class="btn btn-success mx-2" onclick = "editContact(${id})">Edit</button>
                        </td>
                     </tr>`;
        tableBody.innerHTML += row;
      }
    });
}

function deleteContact(e) {
  console.log(e);
    fetch(`https://average-fish-sundress.cyclic.app/removeContact/${e}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => console.log(data))
}
