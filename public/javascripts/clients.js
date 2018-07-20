function generateClientItemHTML(client) {
    return `
    <a href="client.html?clientID=${client.id}" class="listItemLink"><div class="listItem">
                <img src="images/arrow.svg" title="View Client" alt="View Client" />
                <h3>${client.fullName}</h3>
                <p>${client.address.addressString}</p>
            </div></a>`;
  }
  
function generateClientsListHTML(clientsList) {
    const items = clientsList.map((item, index) => generateClientItemHTML(item, index));  
    return items.join("");
  }
  
function renderClientsList() {
    const clientsListHTML = generateClientsListHTML(CLIENTS_STORE);
    $('#js-clients-list').html(clientsListHTML);
  }
  
  // when the page loads, call `handleProviderDashboard`
  $(renderClientsList);
