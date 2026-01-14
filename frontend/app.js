const messages = document.getElementById("messages");
const input = document.getElementById("question");
const sendBtn = document.getElementById("sendBtn");

let userName = null;
let displayName = null;
let userLocation = null;
let step = 0;
let chartType = "bar"; // default
let currencySymbol = "₹"; // change to "$" for dollars
let localeCode = "en-IN"; // change to "en-US" for dollars

// Funny error lines
const funnyErrors = [
  "💔 Oops! Your chatbot is busy... probably flirting with some data models 😘. Try again soon!",
  "💕 Looks like the AI is whispering sweet nothings to BigQuery. Give it a moment!",
  "💞 Our chatbot is in love... with latency. One more try?",
  "💘 Sorry! The chatbot is on a romantic data date. It'll be back soon!",
  "💟 The AI is blushing—too many requests at once. Try again shortly!"
];

function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = "message " + cls;
  div.innerHTML = text;
  messages.appendChild(div);
  scrollToBottom();
}

function launchCapsule() {
  const capsule = document.createElement("div");
  capsule.className = "space-capsule";
  capsule.style.left = "-100px";
  capsule.style.top = Math.random() * window.innerHeight + "px";

  document.body.appendChild(capsule);

  capsule.animate(
    [
      { transform: "translateX(0)", opacity: 1 },
      { transform: `translateX(${window.innerWidth + 200}px)`, opacity: 1 }
    ],
    { duration: 10000, easing: "ease-in-out", fill: "forwards" }
  );

  setTimeout(() => capsule.remove(), 10000);
}
setInterval(launchCapsule, 30000); // every 30 sec


function showAstronaut() {
  const astro = document.createElement("div");
  astro.className = "astronaut";
  document.body.appendChild(astro);
}
window.addEventListener("load", showAstronaut);


function scrollToBottom() {
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  }, 50);
}

function launchSpaceship() {
  const ship = document.createElement("div");
  ship.className = "spaceship";

  // Start at left edge, random vertical position
  const startY = Math.random() * window.innerHeight;
  ship.style.left = "-80px";
  ship.style.top = startY + "px";

  document.body.appendChild(ship);

  // Animate across to right edge
  ship.animate(
    [
      { transform: "translateX(0)", opacity: 1 },
      { transform: `translateX(${window.innerWidth + 100}px)`, opacity: 1 }
    ],
    {
      duration: 6000,
      easing: "linear",
      fill: "forwards"
    }
  );

  setTimeout(() => ship.remove(), 6000);
}

// Trigger every 15 seconds
setInterval(launchSpaceship, 20000);


function launchStar() {
  const star = document.createElement("div");
  star.className = "shooting-star";
  star.style.top = Math.random() * window.innerHeight + "px";
  star.style.left = Math.random() * window.innerWidth + "px";
  document.body.appendChild(star);
  setTimeout(() => star.remove(), 1000);
}



// Trigger every 6 seconds
setInterval(launchStar, 4000);


// Trigger every 6 seconds
//setInterval(launchStar, 6000);





function showSuggestions() {
  addMessage(
    `Here are some questions you can try:<br>
    1) How many countries we have in the list<br>
    2) Total revenue<br>
    3) Top 5 which was having high revenue<br>
    4) Least revenue country<br>
    5) All the data list`,
    "bot"
  );
}

function formatCurrency(value) {
  return `${currencySymbol}${Number(value).toLocaleString(localeCode)}`;
}

function renderChart(results) {
  if (!results || results.length === 0) return;

  // Filter out extreme values (e.g., > 50,000)
  const filteredResults = results.filter(
    row => Number(row.Revenue || row.total_revenue) < 50000
  );

  const labels = filteredResults.map(row => row.Country || row.country || "Unknown");
  const values = filteredResults.map(row => Number(row.Revenue || row.total_revenue) || 0);

  console.log("Rendering chart with:", labels, values);

  if (labels.length === 0 || values.every(v => v === 0)) {
    addMessage("Chart data is missing or invalid.", "bot");
    return;
  }

  const chartWrapper = document.createElement("div");
  chartWrapper.className = "message bot";
  chartWrapper.innerHTML = '<canvas id="chartCanvas"></canvas>';
  messages.appendChild(chartWrapper);

  const ctx = chartWrapper.querySelector("#chartCanvas").getContext("2d");
  new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels,
      datasets: [{
        label: "Revenue",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        title: { display: true, text: "Revenue by Country" },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Revenue: ${formatCurrency(context.raw)}`;
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      }
    }
  });

  scrollToBottom();
}

async function send() {
  const q = input.value.trim();
  if (!q) return;

  addMessage(q, "user");
  input.value = "";

  // Step 0: Ask for name
  if (step === 0) {
    userName = q;

    const naanaNames = [
      "vidhya",
      "sri",
      "srividhya",
      "sri vidhya",
      "sri vidhya gowd",
      "vidhya gowd"
    ];
    const prathyuNames = [ "prathyu", "prathyusha" ];

    if (naanaNames.some(name => userName.toLowerCase().includes(name))) {
      displayName = "Vijju";
      addMessage("Naana, how is Chennai weather?", "bot");
      step = 99;
      return;
    } else if (prathyuNames.some(name => userName.toLowerCase().includes(name))) { 
      displayName = "Prathyu"; 
      addMessage("Congratulations you cleared your own loan — that's inspiring, independent. Keep going girl... How is USA?", "bot"); 
      step = 100; // new flow for Prathyu 
      return; 
    }
      else {
      displayName = userName;
      addMessage(`Hi ${displayName}! 🌟 Where are you from?`, "bot");
      step = 1;
      return;
    }
  }

  // Step 1: Ask for location
  if (step === 1) {
    userLocation = q.trim();

    const lower = userLocation.toLowerCase();
    if (lower.startsWith("i am from ")) {
      userLocation = userLocation.slice(10).trim();
    } else if (lower.startsWith("i'm from ")) {
      userLocation = userLocation.slice(9).trim();
    } else if (lower.startsWith("im from ")) {
      userLocation = userLocation.slice(8).trim();
    } else if (lower.startsWith("i am coming from ")) {
      userLocation = userLocation.slice(18).trim();
    }

    if (userLocation.length > 0) {
      userLocation = userLocation.charAt(0).toUpperCase() + userLocation.slice(1);
    }

    const greeting = `Welcome  ${displayName}! I hope you are doing good. You can now ask me about your sales & revenue data.`;
    addMessage(greeting, "bot");
    document.getElementById("user-greeting").innerText = greeting;
    showSuggestions();
    step = 2;
    return;
  }

  // Step 99: Naana flow
  if (step === 99) {
    const reply = q.toLowerCase();
    if (reply.includes("good") || reply.includes("bad")) {
      addMessage("Cool 😎", "bot");
    } else {
      addMessage("Thanks for sharing, Naana!", "bot");
    }
    addMessage("I know you are a singer — keep singing naanalu 💙", "bot");
    const greeting = "Welcome, Naana! I hope you are doing good. You can now ask me about your sales & revenue data.";
    addMessage(greeting, "bot");
    document.getElementById("user-greeting").innerText = greeting;
    showSuggestions();
    step = 2;
    return;
  }

  // Step 100: Prathyu flow
  if (step === 100) {
    const reply = q.toLowerCase();
    if (reply.includes("good") || reply.includes("great") || reply.includes("positive") || reply.includes("fine") || reply.includes("happy")) {
      addMessage("Keep going... all the best for your job search!", "bot");
    } else {
      addMessage("Your hard work pays off... keep going!", "bot");
    }

    const greeting = `Welcome, ${displayName}! I hope you are doing good. You can now ask me about your sales & revenue data.`;
    addMessage(greeting, "bot");
    document.getElementById("user-greeting").innerText = greeting;
    showSuggestions();
    step = 2; // back to normal flow
    return;
  }


  // Step 3: Chart type selection
  if (step === 3) {
    const reply = q.toLowerCase();
    if (reply.includes("bar")) chartType = "bar";
    else if (reply.includes("line")) chartType = "line";
    else if (reply.includes("pie")) chartType = "pie";
    else chartType = "bar";

    addMessage(`Got it! I'll use a ${chartType} chart.`, "bot");
    step = 2;
    return;
  }

  // Step 2+: Normal chatbot logic
  if (q.toLowerCase().includes("chart") || q.toLowerCase().includes("visualize")) {
    addMessage("Which chart type would you prefer: bar, line, or pie?", "bot");
    step = 3;
    return;
  }

  const thinking = document.createElement("div");
  thinking.className = "message bot";
  thinking.innerText = "Thinking...";
  messages.appendChild(thinking);
  scrollToBottom();

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    thinking.remove();

    if (data.chat_response) {
      addMessage(data.chat_response, "bot");
    }

    if (data.results && data.results.length > 0) {
      const tableWrapper = document.createElement("div");
      tableWrapper.className = "message bot";

      let tableHtml = "<table><thead><tr>";
      Object.keys(data.results[0]).forEach(k => tableHtml += `<th>${k}</th>`);
      tableHtml += "</tr></thead><tbody>";

      data.results.forEach(row => {
        tableHtml += "<tr>";
        Object.entries(row).forEach(([key, v]) => {
          if (key.toLowerCase().includes("revenue")) {
            tableHtml += `<td>${formatCurrency(v)}</td>`;
          } else {
            tableHtml += `<td>${v ?? "-"}</td>`;
          }
        });
        tableHtml += "</tr>";
      });
      tableHtml += "</tbody></table>";

      tableWrapper.innerHTML = tableHtml;
      messages.appendChild(tableWrapper);
      scrollToBottom();

      renderChart(data.results);
    }

  } catch (e) {
    console.error("Error caught:", e);
    if (thinking) thinking.remove();
    const msg = funnyErrors[Math.floor(Math.random() * funnyErrors.length)];
    addMessage(msg, "bot");
  }
}

sendBtn.addEventListener("click", send);

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    send();
  }
});

window.addEventListener("load", function() {
  setTimeout(function() {
    document.getElementById("welcome-message").style.display = "none";
    const chat = document.getElementById("chat-container");
    chat.style.display = "flex";
    chat.style.animation = "fadeInUp 1s ease-in-out";

    addMessage("👋 Hi there! May I know your name?", "bot");
    step = 0;
  }, 1500);
});


//setInterval(launchStar, 4000); // every 6 seconds
