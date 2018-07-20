function generateVisitItemHTML(visit) {
    return `
    <div class="listItem">
                <a href="#" id="js-delete-visit"><img src="images/delete.svg" title="Delete Visit" alt="Delete Visit" /></a>
                <h3>${visit.startTime}</h3>
                <p>${visit.client}</p>
            </div>`;
  }
  
function generateAllVisitsHTML(visitsList) {
    const items = visitsList.map((item, index) => generateVisitItemHTML(item, index));  
    return items.join("");
  }
  
function renderAllVisitsList() {
    const recentVisitsHTML = generateAllVisitsHTML(VISITS_STORE);
    $('#js-visits-list').html(recentVisitsHTML);
  }

//modal action
function handleDeleteVisit(){
    $('#js-visits-list').on("click", "#js-delete-visit", event => {
        event.preventDefault();
        console.log('`handleDeleteVisit` ran');
      }); 
}

function handleProviderDashboard() {
    renderAllVisitsList();
    handleDeleteVisit();
  }
  
  // when the page loads, call `handleProviderDashboard`
  $(handleProviderDashboard);