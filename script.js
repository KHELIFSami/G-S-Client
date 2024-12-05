// Sélection des éléments du DOM
const clientTableBody = document.getElementById("clientTableBody");
const addClientDialog = document.getElementById("addClientDialog");
const editClientDialog = document.getElementById("editClientDialog");
const addClientForm = document.getElementById("addClientForm");
const editClientForm = document.getElementById("editClientForm");
const addClientBtn = document.getElementById("addClientBtn");
const closeAddDialog = document.getElementById("closeAddDialog");
const closeEditDialog = document.getElementById("closeEditDialog");
const searchInput = document.getElementById("search");


let clients = JSON.parse(localStorage.getItem("clients")) || [];
let clientIdCounter = clients.length > 0 ? clients[clients.length - 1].id + 1 : 1;

saveClientsToLocalStorage();
renderClients();

// Ouvrir le formulaire d'ajout
addClientBtn.addEventListener("click", () => {
  addClientForm.reset();
  addClientDialog.showModal();
});

// Fermer le formulaire d'ajout
closeAddDialog.addEventListener("click", () => addClientDialog.close());

// Ajouter un nouveau client
addClientForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newClient = {
    id: clientIdCounter++,
    lastName: document.getElementById("lastName").value.trim(),
    firstName: document.getElementById("firstName").value.trim(),
    priceType: document.getElementById("priceType").value.trim(),
    wilaya: document.getElementById("wilaya").value.trim(),
    credit: 0,
    description: document.getElementById("description").value.trim(),
  };

  clients.push(newClient);
  saveClientsToLocalStorage();
  renderClients();
  addClientDialog.close();
});

// Ouvrir le formulaire de modification
function openEditClientDialog(clientId) {
  const client = clients.find((c) => c.id === clientId);
  if (!client) return;

  document.getElementById("editLastName").value = client.lastName;
  document.getElementById("editFirstName").value = client.firstName;
  document.getElementById("editPriceType").value = client.priceType;
  document.getElementById("editWilaya").value = client.wilaya;
  document.getElementById("editDescription").value = client.description;

  editClientForm.dataset.clientId = client.id;
  editClientDialog.showModal();
}

// Fermer le formulaire de modification
closeEditDialog.addEventListener("click", () => editClientDialog.close());

// Modifier un client
editClientForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const clientId = parseInt(editClientForm.dataset.clientId, 10);
  const client = clients.find((c) => c.id === clientId);
  if (!client) return;

  client.lastName = document.getElementById("editLastName").value.trim();
  client.firstName = document.getElementById("editFirstName").value.trim();
  client.priceType = document.getElementById("editPriceType").value.trim();
  client.wilaya = document.getElementById("editWilaya").value.trim();
  client.description = document.getElementById("editDescription").value.trim();

  saveClientsToLocalStorage();
  renderClients();
  editClientDialog.close();
});

// Rendre les clients dans la table
function renderClients( filteredClients = clients) {
  clientTableBody.innerHTML = "";
  filteredClients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${client.id}</td>
      <td>${client.lastName}</td>
      <td>${client.firstName}</td>
      <td>${client.priceType}</td>
      <td>${client.wilaya}</td>
      <td>${client.credit} DA</td>
      <td>${client.description}</td>
      <td>
        <button onclick="openEditClientDialog(${client.id})">Modifier</button>
        <button onclick="updateCredit(${client.id})">Crédit</button>
        <button onclick="deleteClient(${client.id})">Supprimer</button>
      </td>
    `;
    clientTableBody.appendChild(row);
  });
}

// Supprimer un client
function deleteClient(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
    clients = clients.filter((c) => c.id !== id);

    clients.forEach((client, index) => client.id = index + 1); 
    clientIdCounter = clients.length > 0 ? clients[clients.length - 1].id + 1 : 1;
    
    saveClientsToLocalStorage();
    renderClients();
  }
}

// Enregistrer dans le localStorage
function saveClientsToLocalStorage() {
  localStorage.setItem("clients", JSON.stringify(clients));
}


// Mettre à jour le crédit d'un client
function updateCredit(id) {
  const client = clients.find((c) => c.id === id);
  if (client) {
    const newCredit = prompt(
      `Entrez le nouveau crédit pour ${client.lastName} ${client.firstName} :`,
      client.credit
    );
    if (newCredit !== null && !isNaN(newCredit)) {
      client.credit = parseFloat(newCredit);
      saveClientsToLocalStorage();
      renderClients();
    }
  }
}

// Rechercher un client par nom
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filteredClients = clients.filter(
    (client) =>
      client.lastName.toLowerCase().includes(query) ||
      client.firstName.toLowerCase().includes(query)
  );
  renderClients(filteredClients);
});

// Charger les clients à l'ouverture
renderClients();
saveClientsToLocalStorage();
