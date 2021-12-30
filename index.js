const fishTable = document.getElementById("fish");
const mainContainer = document.getElementById("main-container");
const newPlayerForm = document.getElementById("new-player-form");
const editPlayerForm = document.getElementById("edit-player-form");
const newPlayerBtn = document.getElementById("new-player-btn");
const cancelFormBtn = document.getElementById("cancel-button");
const deleteBtn = document.getElementById("delete-button");
const tableRows = document.getElementsByTagName("tr");
let currentId;

newPlayerBtn.addEventListener("click", () => {
  renderForm(newPlayerForm);
});

cancelFormBtn.addEventListener("click", () => {
  cancelForm();
});

const resetTable = () => {
  Array.from(tableRows).forEach((tr) => {
    if (tr.id != "") {
      tr.remove();
    }
  });
};

const renderForm = (form) => {
  form.style.display = "flex";
  newPlayerBtn.style.display = "none";
  fishTable.style.visibility = "hidden";
  cancelFormBtn.style.display = "flex";
  if (form == editPlayerForm) {
    deleteBtn.style.display = "flex";
  }
};

const cancelForm = () => {
  newPlayerForm.style.display = "none";
  editPlayerForm.style.display = "none";
  deleteBtn.style.display = "none";
  cancelFormBtn.style.display = "none";
  fishTable.style.visibility = "visible";
  newPlayerBtn.style.display = "flex";
};

newPlayerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  postNewPlayer(setPlayer(e.target));
});

editPlayerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  editPlayer(setPlayer(e.target), currentId);
});

deleteBtn.addEventListener("click", () => {
  deletePlayer(currentId);
});

const setPlayer = (data) => {
  let newPlayerObject = {
    name: data[0].value,
    gp: parseInt(data[1].value),
    goals: parseInt(data[2].value),
    assists: parseInt(data[3].value),
    points: 0,
    pm: parseInt(data[4].value),
  };
  return newPlayerObject;
};

const postNewPlayer = (player) => {
  newPlayerForm.reset();
  fetch("http://localhost:3000/players", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  }).then(() => {
    fetchPlayers();
    cancelForm();
  });
};

const fetchPlayer = (id) => {
  fetch(`http://localhost:3000/players/${id}`)
    .then((response) => response.json())
    .then((player) => {
      populatePlayerForm(player);
    });
};

const populatePlayerForm = (player) => {
  renderForm(editPlayerForm);
  editPlayerForm[0].value = player.name;
  editPlayerForm[1].value = player.gp;
  editPlayerForm[2].value = player.goals;
  editPlayerForm[3].value = player.assists;
  editPlayerForm[4].value = player.pm;
  currentId = player.id;
};

const editPlayer = (player, id) => {
  editPlayerForm.reset();
  fetch(`http://localhost:3000/players/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  }).then(() => {
    document.getElementById(id).remove();
    fetchPlayers();
    cancelForm();
  });
};

const deletePlayer = (id) => {
  fetch(`http://localhost:3000/players/${id}`, {
    method: "DELETE",
  }).then((response) => {
    response.json();
    fetchPlayers();
    cancelForm();
  });
};

const fetchPlayers = () => {
  resetTable();
  fetch("http://localhost:3000/players")
    .then((response) => response.json())
    .then((players) => {
      players.forEach((element) => {
        renderPlayerRow(element);
      });
    });
};

const getPoints = (player) => {
  return (player.points = player.goals + player.assists);
};

const renderPlayerRow = (player) => {
  fishTable.innerHTML += `<tr id=${player.id} onclick="fetchPlayer(${
    player.id
  })">
    ${renderPlayerData(player.name)}
    ${renderPlayerData(player.gp)}
    ${renderPlayerData(player.goals)}
    ${renderPlayerData(player.assists)}
    ${renderPlayerData(getPoints(player))}
    ${renderPlayerData(player.pm)}
    </tr>`;
};

const renderPlayerData = (data) => {
  return (fishTable.innerHTML = `<td>${data}</td>`);
};

fetchPlayers();
