const socket = new WebSocket("wss://YOUR_BACKEND");

socket.onmessage = (event) => {

  const nodes = JSON.parse(event.data);

  document.getElementById("nodes").innerHTML =
    nodes.map(n => `
      <div class="card">
        <h3>${n.id}</h3>
        <p>Load: ${n.load}%</p>
        <p>Risk: ${n.risk}</p>
        <p>Forecast: ${n.forecast}%</p>
      </div>
    `).join("");

};
