const STORE = [{
    user: 001, // provider who owns it
    client: "John Doe",
    startTime: "June 29, 9:00 AM",
    endTime: "June 29, 9:00 AM",
    recurrence: null,
},
{
    user: 001, // provider who owns it
    client: "John Doe",
    startTime: "June 30, 9:00 AM",
    endTime: "June 30, 9:00 AM",
    recurrence: null,
},
{
    user: 001, // provider who owns it
    client: "John Doe",
    startTime: "June 31, 9:00 AM",
    endTime: "June 31, 9:00 AM",
    recurrence: null,
}];

function generateClientItemHTML(item, itemIndex, template) {
    return `
    <a href="#" id="js-client-detail" class="listItemLink"><div class="listItem">
                <img src="images/arrow.svg" title="View Client" alt="View Client" />
                <h3>${item.client}</h3>
                <p>Next Visit: ${item.startTime}</p>
            </div></a>`;
  }
  
function generateClientsListHTML(visitsList) {
    const items = visitsList.map((item, index) => generateClientItemHTML(item, index));  
    return items.join("");
  }
  
function renderClientsList() {
    // render the list in the DOM
    const clientsListHTML = generateClientsListHTML(STORE);
    // insert that HTML into the DOM
    $('#js-clients-list').html(clientsListHTML);
  }

function handleClientDetail(){
    $('#js-clients-list').on("click", "#js-client-detail", event => {
        console.log('`handleClientDetail` ran');
      }); 
}

function handleAllClientsList() {
    renderClientsList();
    handleClientDetail();
  }
  
  // when the page loads, call `handleProviderDashboard`
  $(handleAllClientsList);