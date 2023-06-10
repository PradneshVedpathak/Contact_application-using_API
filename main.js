showData();
var firstName = document.getElementById("userFirstName").value;
var lastName = document.getElementById("userLastName").value;
var contactNumber = document.getElementById("userNumber").value;
var idOfData;
var photoURL;

function takePicture() {
  let a = document.getElementById("addDocument");
  let b = document.getElementById("takePhoto");
  let c = document.getElementById("savePhoto");
  let d = document.getElementById("camera");
  a.hidden = true;
  b.hidden = true;
  c.hidden = false;
  d.hidden = false;

  Webcam.set({
    width: 300,
    higth: 300,
    image_format: "jpg",
  });

  Webcam.attach(d);
}

function savePhoto() {
  Webcam.snap(function (data_uri) {
    photoURL = data_uri;
    console.log(data_uri);
    document.getElementById("camera").innerHTML = `
    <img src= "${data_uri}"/>`;
  });
}

function addDocument() {
  let a = document.getElementById("addDocument");
  let b = document.getElementById("chooseFile");
  let c = document.getElementById("takePhoto");
  let d = document.getElementById("camera");
  a.hidden = true;
  b.hidden = false;
  c.hidden = true;
  d.hidden = false;

  b.addEventListener("change", (event) => {
    console.log(event);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      console.log(reader.result);
    });

    reader.readAsDataURL(file);
  });
}

//Adding data to DB
function addData() {
  setTimeout(() => {
    location.reload();
  }, 1000);

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
      profileImg: photoURL,
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

//Printing data from DB
function showData() {
  fetch("https://average-fish-sundress.cyclic.app/allContacts", {
    method: "GET",
    headers: { "Content-type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      var tableHead = document.getElementById("thead");
      var tableBody = document.getElementById("tbody");
      var output = "";

      tableHead.innerHTML = `<tr>
                              <td>ProfileImg</td>
                              <td>FirstName</td>
                              <td>LastName</td>
                              <td>PhoneNumber</td>
                              <td>Operations</td>
                             </tr>`;

      data.forEach((data) => {
        output += `<tr style = "text-align: center;" data-id =${data._id}>
                        <td><img style="width: 70px; height: 70px;" src = "${data.profileImg}"></td>
                        <td>${data.firstName}</td>
                        <td>${data.lastName}</td>
                        <td>${data.phoneNumber}</td>
                        <td>
                        <button class="btn btn-success mx-2" id = "edit-post">Edit</button>
                        <button class = "btn btn-danger mx-2" id = "delete-post">Delete</button>
                        </td>
                     </tr>`;
      });

      tableBody.innerHTML = output;
      operations();
    });
}

function operations() {
  var tableBody = document.getElementById("tbody");

  tableBody.addEventListener("click", (e) => {
    e.preventDefault();
    var deleteBtnIsPressed = e.target.id == "delete-post";
    var editBtnIsPressed = e.target.id == "edit-post";
    var id = e.target.parentElement.parentElement.dataset.id;

    if (deleteBtnIsPressed) {
      deleteData(id);
    }

    if (editBtnIsPressed) {
      editData(id);
    }
  });
}

function deleteData(e) {
  fetch(`https://average-fish-sundress.cyclic.app/removeContact/${e}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      location.reload();
    });
}

function editData(e) {
  fetch(`https://average-fish-sundress.cyclic.app/contact/${e}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      idOfData = e;
      let a = document.getElementById("addUserbtn");
      let b = document.getElementById("updateUserBtn");

      a.hidden = true;
      b.hidden = false;

      document.getElementById("userFirstName").value = response.firstName;
      document.getElementById("userLastName").value = response.lastName;
      document.getElementById("userNumber").value = response.phoneNumber;
      backToTop()
    });
}

function updateContact() {
  firstName = document.getElementById("userFirstName").value;
  lastName = document.getElementById("userLastName").value;
  contactNumber = document.getElementById("userNumber").value;

  fetch("https://average-fish-sundress.cyclic.app/updateContact", {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      _id: idOfData,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: contactNumber,
      profileImg: photoURL,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      setTimeout(() => {
        location.reload();
      }, 1000);
      
    });
}

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}