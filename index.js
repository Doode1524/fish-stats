const fishTable = document.getElementById("fish");
const newPlayerBtn = document.getElementById("new-player-btn");
const newPlayerForm = document.getElementById("new-player-form");
const editPlayerForm = document.getElementById("edit-player-form");
const cancelFormBtn = document.getElementById("cancel-button");
const deleteBtn = document.getElementById("delete-button");
const tableRows = document.getElementsByTagName("tr");

newPlayerBtn.addEventListener("click", () => {
  renderForm(newPlayerForm);
});

cancelFormBtn.addEventListener("click", () => {
  cancelForm();
});

newPlayerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  postNewPlayer(setPlayer(e.target));
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
  newPlayerForm.reset()
  fetch("http://localhost:3000/players", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  }).then(() => {
    fetchPlayers();
    cancelForm();
  });
};

const renderForm = (form) => {
  form.style.display = "flex";
  newPlayerBtn.style.display = "none";
  fishTable.style.visibility = "hidden";
  cancelFormBtn.style.display = "flex";
};

const cancelForm = () => {
  newPlayerForm.style.display = "none";
  editPlayerForm.style.display = "none";
  deleteBtn.style.display = "none";
  cancelFormBtn.style.display = "none";
  newPlayerBtn.style.display = "flex";
  fishTable.style.visibility = "visible";
};

const resetTable = () => {
  Array.from(tableRows).forEach((tr) => {
    if (tr.id != "") {
      tr.remove();
    }
  });
};

const fetchPlayers = () => {
  resetTable();
  fetch("http://localhost:3000/players")
    .then((response) => response.json())
    .then((players) => {
      players.forEach((player) => {
        renderPlayerRow(player);
      });
    });
};

fetchPlayers();

const getPoints = (player) => {
  return (player.points = player.goals + player.assists);
};

const renderPlayerRow = (player) => {
  fishTable.innerHTML += `
   <tr id=${player.id}>
    ${renderPlayerData(player.name)}
    ${renderPlayerData(player.gp)}
    ${renderPlayerData(player.goals)}
    ${renderPlayerData(player.assists)}
    ${renderPlayerData(getPoints(player))}
    ${renderPlayerData(player.pm)}
   </tr>  `;
};

const renderPlayerData = (data) => {
  return `<td>${data}</td>`;
};
