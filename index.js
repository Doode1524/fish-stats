const fishTable = document.getElementById("fish");

const fetchPlayers = () => {
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
   <tr>
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

