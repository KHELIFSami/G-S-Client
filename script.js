// Sélectionner les éléments du DOM
const clientTableBody = document.getElementById('clientTableBody');
const addClientDialog = document.getElementById('addClientDialog');
const addClientForm = document.getElementById('addClientForm');
const addClientBtn = document.getElementById('addClientBtn');
const closeDialog = document.getElementById('closeDialog');
const searchInput = document.getElementById('search');

// Charger les clients depuis le localStorage
let clients = JSON.parse(localStorage.getItem('clients')) || [];
let clientIdCounter = clients.length > 0 ? clients[clients.length - 1].id + 1 : 1;

// Ouvrir le formulaire d'ajout
addClientBtn.addEventListener('click', () => addClientDialog.showModal());

// Fermer le formulaire d'ajout
closeDialog.addEventListener('click', () => addClientDialog.close());

// Ajouter un client
addClientForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Récupérer les données du formulaire
    const lastName = document.getElementById('lastName').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const priceType = document.getElementById('priceType').value.trim();
    const wilaya = document.getElementById('wilaya').value.trim();
    const description = document.getElementById('description').value.trim() || "";

    // Validation des champs
    if (!lastName || !firstName || !priceType || !wilaya) {
        alert('Tous les champs obligatoires doivent être remplis.');
        return;
    }

    // Créer un nouveau client
    const newClient = {
        id: clientIdCounter++,
        lastName,
        firstName,
        priceType,
        wilaya,
        credit: 0,
        description,
    };

    clients.push(newClient);
    saveClientsToLocalStorage();
    renderClients();
    addClientDialog.close();
    addClientForm.reset();
});

// Afficher les clients dans le tableau
function renderClients(filteredClients = clients) {
    clientTableBody.innerHTML = "";
    filteredClients.forEach(client => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', client.id); // Ajouter un attribut personnalisé pour identifier la ligne
        row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.lastName}</td>
            <td>${client.firstName}</td>
            <td>${client.priceType}</td>
            <td>${client.wilaya}</td>
            <td>${client.credit} DA</td>
            <td>${client.description}</td>
            <td>
                <button class="edit-btn" onclick="editClient(${client.id})">Modifier</button>
                <button class="credit-btn" onclick="updateCredit(${client.id})">Crédit</button>
                <button class="delete-btn" onclick="deleteClient(${client.id})">Supprimer</button>
            </td>
        `;
        clientTableBody.appendChild(row);
    });
}

// Enregistrer les clients dans le localStorage
function saveClientsToLocalStorage() {
    localStorage.setItem('clients', JSON.stringify(clients));
}

// Modifier un client
function editClient(id) {
    const client = clients.find(c => c.id === id);
    if (client) {
        // Pré-remplir le formulaire avec les données du client
        document.getElementById('lastName').value = client.lastName;
        document.getElementById('firstName').value = client.firstName;
        document.getElementById('priceType').value = client.priceType;
        document.getElementById('wilaya').value = client.wilaya;
        document.getElementById('description').value = client.description;
        addClientDialog.showModal();

        // Mettre à jour le client lors de la soumission du formulaire
        addClientForm.onsubmit = (e) => {
            e.preventDefault();
            updateClientData(client);
            updateClientRow(client); // Mettre à jour la ligne du tableau avec les nouvelles données
        };
    }
}

// Mettre à jour les données d'un client dans le tableau
function updateClientData(client) {
    client.lastName = document.getElementById('lastName').value.trim();
    client.firstName = document.getElementById('firstName').value.trim();
    client.priceType = document.getElementById('priceType').value.trim();
    client.wilaya = document.getElementById('wilaya').value.trim();
    client.description = document.getElementById('description').value.trim();

    saveClientsToLocalStorage();
}

// Mettre à jour la ligne du client dans le tableau
function updateClientRow(client) {
    const clientRow = document.querySelector(`tr[data-id='${client.id}']`);
    if (clientRow) {
        clientRow.innerHTML = `
            <td>${client.id}</td>
            <td>${client.lastName}</td>
            <td>${client.firstName}</td>
            <td>${client.priceType}</td>
            <td>${client.wilaya}</td>
            <td>${client.credit} DA</td>
            <td>${client.description}</td>
            <td>
                <button class="edit-btn" onclick="editClient(${client.id})">Modifier</button>
                <button class="credit-btn" onclick="updateCredit(${client.id})">Crédit</button>
                <button class="delete-btn" onclick="deleteClient(${client.id})">Supprimer</button>
            </td>
        `;
    }
    addClientDialog.close();
    addClientForm.reset();
}

// Supprimer un client
function deleteClient(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
        clients = clients.filter(client => client.id !== id);

        // Réajuster les IDs des clients restants
        clients.forEach((client, index) => client.id = index + 1);

        clientIdCounter = clients.length > 0 ? clients[clients.length - 1].id + 1 : 1;

        saveClientsToLocalStorage();
        renderClients();
    }
}

// Mettre à jour le crédit d'un client
function updateCredit(id) {
    const client = clients.find(c => c.id === id);
    if (client) {
        const newCredit = prompt(`Entrez le nouveau crédit pour ${client.lastName} ${client.firstName} :`, client.credit);
        if (newCredit !== null && !isNaN(newCredit)) {
            client.credit = parseFloat(newCredit);
            saveClientsToLocalStorage();
            renderClients();
        }
    }
}

// Rechercher un client par nom
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredClients = clients.filter(client =>
        client.lastName.toLowerCase().includes(query) ||
        client.firstName.toLowerCase().includes(query)
    );
    renderClients(filteredClients);
});

// Charger les clients à l'ouverture
renderClients();
