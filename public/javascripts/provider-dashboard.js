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

function generateVisitItemHTML(item, itemIndex, template) {
    return `
    <div class="listItem">
                <a href="#" id="js-delete-visit"><img src="images/delete.svg" title="Delete Visit" alt="Delete Visit" /></a>
                <h3>${item.startTime}</h3>
                <p>${item.client}</p>
            </div>`;
  }
  
function generateUpcomingVisitsHTML(visitsList) {
    const items = visitsList.map((item, index) => generateVisitItemHTML(item, index));  
    return items.join("");
  }
  
function renderRecentVisitsList() {
    // render the list in the DOM
    const recentVisitsHTML = generateUpcomingVisitsHTML(STORE);
    // insert that HTML into the DOM
    $('#js-recent-visits-list').html(recentVisitsHTML);
  }

//modal action
function handleDeleteVisit(){
    $('#js-recent-visits-list').on("click", "#js-delete-visit", event => {
        event.preventDefault();
        console.log('`handleDeleteVisit` ran');
      }); 
}

function handleSearchClientSubmit(){
    $('#js-search-client').submit(event => {
        event.preventDefault();
        console.log('`handleSearchClientSubmit` ran');
      }); 
}

function handleProviderDashboard() {
    renderRecentVisitsList();
    handleDeleteVisit();
    handleSearchClientSubmit();
  }
  
  // when the page loads, call `handleProviderDashboard`
  $(handleProviderDashboard);