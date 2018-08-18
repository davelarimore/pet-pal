const visits = (function () {

    ///////////////////////////////////////////
    //All Visits Screen
    ///////////////////////////////////////////
    function _displayAllVisits() {
        console.log(auth.getCurrentUser().visits);
        const visitsListHTML = _generateAllVisitsHTML(auth.getCurrentUser().visits);
        $('#js-main').html(`
        <div class='boxed'>
            <h2>Visits</h2>
            <div id='js-visits-list'>
                ${visitsListHTML}
            </div>
            <a class='button' href='#addVisit'>Add Visit</a>
        </div>`);
    }
    function _generateAllVisitsHTML(visitsData) {
        const items = visitsData.map((item, index) => _generateVisitItemHTML(item, index));
        return items.join('');
    }
    function _generateVisitItemHTML(visit) {
        const formattedStartTime = _formatDate(visit.startTime, visit.endTime)
        return `
        <div class='listItem'>
            <a href='#' class='js-delete-visit' data-id='${visit._id}'><img src='images/delete.svg' title='Delete Visit' alt='Delete Visit' /></a>
            <h3>${formattedStartTime}</h3>
            <p><a href='#clientDetail/${visit.client._id}/'>${visit.client.firstName} ${visit.client.lastName}</a></p>
            <p><a href='https://www.google.com/maps/search/${visit.client.addressString}'>${visit.client.addressString}</a></p>
        </div>`;
    }

    ///////////////////////////////////////////
    //Upcoming visit
    ///////////////////////////////////////////
    function _generateUpcomingVisitsHTML(visitsData) {
        //first three items only
        const items = visitsData.slice(0, 3).map((item, index) => _generateVisitItemHTML(item, index));
        return items.join('');
    }

    ///////////////////////////////////////////
    //Add Visit Screen
    ///////////////////////////////////////////
    function _displayAddVisitForm() {
        const clientListHTML = _generateClientSelectHTML(auth.getCurrentUser().clients);
        const element = $(templates.addVisitForm);
        element.find('#provider').data('id', auth.getCurrentUser()._id);
        element.find('#js-client-list').append(clientListHTML);
        $('#js-main').html(element);
    }
    function _generateClientOptionHTML(client) {
        if (!client.provider) {
            return `
        <option value='${client.firstName} ${client.lastName}' data-id='${client._id}'>${client.firstName} ${client.lastName}</option>`
        }
    }
    function _generateClientSelectHTML(clientsData) {
        const items = clientsData.map((item, index) => _generateClientOptionHTML(item, index));
        return items.join('');
    }
    function _handleAddVisitSubmit() {
        $('#js-main').on('submit', '#js-add-visit-form', event => {
            event.preventDefault();
            const visitData = {
                providerId: $(event.currentTarget).find('#provider').data('id'),
                client: $(event.currentTarget).find(':selected').data('id'),
                startTime: $(event.currentTarget).find('#startTime').val(),
                endTime: $(event.currentTarget).find('#endTime').val(),
            };
            _addVisitAndDisplayAlertDialog(visitData);
        });
    }
    $(_handleAddVisitSubmit);
    function _addVisitAndDisplayAlertDialog(data) {
        api.addVisit(data)
        .then(auth.updateCurrentUser())
        .then(window.location.href = `./#providerDashboard`);
    }
    
    ///////////////////////////////////////////
    //Delete visit
    ///////////////////////////////////////////
    function _handleDeleteVisit() {
        $('#js-main').on('click', '.js-delete-visit', event => {
            event.preventDefault();
            const visitId = $(event.currentTarget).data('id');
            if (confirm('Delete pet?')) {
                api.deleteVisit(visitId)
                    .then(() => auth.updateCurrentUser())
                    .then(() => users.displayAlertDialog('Visit Deleted'))
                    .then(() => {
                        users.displayProviderDashboard();
                    })
            } else {
                alert('Action Cancelled');
            }
        })
    }
    $(_handleDeleteVisit)

    ///////////////////////////////////////////
    //Date Formatter
    ///////////////////////////////////////////
    function _formatDate(startIsoDate, endIsoDate) {
        const startDate = new Date(startIsoDate);
        const endDate = new Date(endIsoDate);
        const monthNames = ["Jan.", "Feb.", "March", "April", "May", "June",
            "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
        ];
        return (monthNames[startDate.getMonth() + 1]) +
            ' ' + startDate.getDate() +
            ', ' + startDate.toTimeString().substr(0, 5) + '-' + endDate.toTimeString().substr(0, 5);
    }

    return {
        displayAllVisits: _displayAllVisits,
        generateUpcomingVisitsHTML: _generateUpcomingVisitsHTML,
        displayAddVisitForm: _displayAddVisitForm,
        formatDate: _formatDate
    };
})();
