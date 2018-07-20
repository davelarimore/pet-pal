//Visits
function generateVisitItemHTML(visit) {
    return `
    <div class="listItem">
                <a href="#" id="js-delete-visit"><img src="images/delete.svg" title="Delete Visit" alt="Delete Visit" /></a>
                <h3>${visit.startTime}</h3>
                <p>${visit.client}</p>
            </div>`;
  }
  
function generateUpcomingVisitsHTML(visitsList) {
    const items = visitsList.map((item, index) => generateVisitItemHTML(item, index));  
    return items.join("");
  }
  
function renderRecentVisitsList() {
    const recentVisitsHTML = generateUpcomingVisitsHTML(VISITS_STORE);
    $('#js-recent-visits-list').html(recentVisitsHTML);
  }

//modal action
function handleDeleteVisit(){
    $('#js-recent-visits-list').on("click", "#js-delete-visit", event => {
        event.preventDefault();
        console.log('`handleDeleteVisit` ran');
      }); 
}

//Clients
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