const visits = (function () {

    ///////////////////////////////////////////
    //All Visits Screen
    ///////////////////////////////////////////
    function _displayAllVisits() {
        const visitsListHTML = _generateAllVisitsHTML(auth.getCurrentUser().visits) || `<p class='noVisit'>No visits scheduled</p>`;
        $('#js-main').html(`
        <div class='boxed'>
            <h2>All Visits</h2>
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
            <div class='listItemInfo'>
                <h3>${formattedStartTime}</h3>
                <p><span><a href='#clientDetail/${visit.client._id}/'>${visit.client.firstName} ${visit.client.lastName}&nbsp;&nbsp;-</a>&nbsp;&nbsp;</span><a href='https://www.google.com/maps/search/${visit.client.addressString}'>${visit.client.addressString}</a></p>
            </div>
            <a href='#' class='js-delete-visit' data-id='${visit._id}'><img src='images/delete.svg' title='Delete Visit' alt='Delete Visit' /></a>
        </div>`;
    }

    ///////////////////////////////////////////
    //Upcoming visit
    ///////////////////////////////////////////
    function _generateUpcomingVisitsHTML(visitsData) {
        const mapHTML = `
        <div id='map' class='visitsMap'></div>
        <a class='button openMap' id='js-open-map' target='_blank' href=''>Open in Google maps</a>
        `;
        //first three items only
        const visitsHTML = visitsData.slice(0, 3).map((item, index) => _generateVisitItemHTML(item, index));
        return mapHTML + visitsHTML.join('');
    }

    ///////////////////////////////////////////
    //Map upcoming visits
    ///////////////////////////////////////////

    function _mapsSelector() {
        //If we're on iOS, open in Apple Maps 
        if ((navigator.platform.indexOf('iPhone') != -1) ||
        (navigator.platform.indexOf('iPod') != -1) ||
        (navigator.platform.indexOf('iPad') != -1))
            return 'maps://www.google.com/maps/dir/?api=1&travelmode=driving';
        //Else use Google
        else 
            return 'https://www.google.com/maps/dir/?api=1&travelmode=driving';
    }

    // Geocode address helper
    function _geoCodeAddress(address) {
        return new Promise((resolve, reject) => {
            let clientLatLng = [];
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == 'OK') {
                    clientLatLng = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
                    resolve(clientLatLng);
                } else {
                    reject('Geocode was not successful for the following reason: ' + status);
                }
            });
        })
    }

    // Build locations array
    function _getNextDaysLocations(providerData) {
        const nextMonth = new Date(providerData.visits[0].startTime).getMonth();
        const nextDay = new Date(providerData.visits[0].startTime).getDate();

        //Seed the route array with the provider address
        const providerPromise = _geoCodeAddress(providerData.addressString)
            .then((latLng) => {
                return [providerData.companyName, latLng[0], latLng[1], providerData.addressString];
            });
        //Add the client addresses
        const visitPromises = providerData.visits.filter(visit => {
            const visitMonth = new Date(visit.startTime).getMonth();
            const visitDay = new Date(visit.startTime).getDate();
            return visitMonth === nextMonth && visitDay === nextDay;
        }).map(visit => {
            const clientFullName = `${visit.client.firstName} ${visit.client.lastName}`;
            return _geoCodeAddress(visit.client.addressString)
                .then((clientLatLng) => {
                    return [
                        clientFullName,
                        clientLatLng[0],
                        clientLatLng[1],
                        visit.client.addressString,
                        visit.startTime,
                        visit.endTime];
                })
        });
        return Promise.all([providerPromise, ...visitPromises]);
    }

    //Render map with locations
    function _mapUpcomingVisits(locations) {
        let openMapURL = _mapsSelector();
        let openMapURLWaypoints = '&waypoints=';
        let directionsDisplay = '';
        const directionsService = new google.maps.DirectionsService();

        directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true} );

        const visitsMap = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        directionsDisplay.setMap(visitsMap);
        const infowindow = new google.maps.InfoWindow();
        let marker, i;
        const request = {
            travelMode: google.maps.TravelMode.DRIVING
        };

        const bounds = new google.maps.LatLngBounds();

        for (i = 0; i < locations.length; i++) {
            const iconIndex = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
            const iconPath = i===0
                ? `images/map-markers/green_marker_${iconIndex[i]}.png`
                : `images/map-markers/yellow_marker_${iconIndex[i]}.png`;
            const clientLatLng = new google.maps.LatLng(locations[i][1], locations[i][2])
            marker = new google.maps.Marker({
                position: clientLatLng,
                map: visitsMap,
                title: locations[i][0],
                icon: iconPath
            });

            bounds.extend(clientLatLng);

            //Info windows for markers
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    if (locations[i][4]) {
                        const visitTimes = _formatTime(locations[i][4], locations[i][5]);
                        infowindow.setContent(`<p><span>${locations[i][0]}</span></p><p>${visitTimes}</p>`);
                    } else {
                        infowindow.setContent(`<p><span>${locations[i][0]}</span></p>`);
                    }
                    infowindow.open(map, marker);
                }
            })(marker, i));

            //Build the map request and the 'open map' URL simultaneously
            if (i == 0) {
                request.origin = marker.getPosition();
                openMapURL = openMapURL + `&origin=${encodeURIComponent(locations[i][3])}`
            }
            else if (i == locations.length - 1) {
                request.destination = marker.getPosition();
                openMapURL = openMapURL + `&destination=${encodeURIComponent(locations[i][3])}`
            }
            else {
                if (!request.waypoints) request.waypoints = [];
                openMapURLWaypoints = openMapURLWaypoints + `${encodeURIComponent(locations[i][3])}%7C`
                request.waypoints.push({
                    location: marker.getPosition(),
                    stopover: true
                });
            }
        }
        visitsMap.fitBounds(bounds);
        visitsMap.setCenter(bounds.getCenter());
        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                //Set the 'open map' URL
                $('#js-open-map').attr('href', openMapURL + openMapURLWaypoints)
                //Render the map
                directionsDisplay.setDirections(result);
            }
        });
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
        $('#startTime').datetimepicker();
        $('#endTime').datetimepicker();
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
            .then(() => {
                window.location.href = `./#visits`;
                common.displayAlertDialog('Visit Added');
            });
    }

    ///////////////////////////////////////////
    //Delete visit
    ///////////////////////////////////////////
    function _handleDeleteVisit() {
        $('#js-main').on('click', '.js-delete-visit', event => {
            event.preventDefault();
            const visitId = $(event.currentTarget).data('id');
            common.displayConfirmDialog('Delete visit?',
                () => { _deleteVisit(visitId) },
            )
        })
    }
    $(_handleDeleteVisit)

    function _deleteVisit(visitId) {
        api.deleteVisit(visitId)
            .then(() => auth.updateCurrentUser())
            .then(() => {
                common.displayCompactSiteHeader();
                visits.displayAllVisits();
                common.displayAlertDialog('Visit Deleted')
            })
    }

    ///////////////////////////////////////////
    //Date Formatter
    ///////////////////////////////////////////
    function _formatDate(startIsoDate, endIsoDate) {
        const startDate = new Date(startIsoDate);
        const endDate = new Date(endIsoDate);
        const monthNames = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June',
            'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'
        ];
        return (monthNames[startDate.getMonth()]) +
            ' ' + startDate.getDate() +
            ', ' + startDate.toTimeString().substr(0, 5) + '-' + endDate.toTimeString().substr(0, 5);
    }
    function _formatTime(startIsoDate, endIsoDate) {
        const startDate = new Date(startIsoDate);
        const endDate = new Date(endIsoDate);
        return startDate.toTimeString().substr(0, 5) + '-' + endDate.toTimeString().substr(0, 5);
    }

    return {
        displayAllVisits: _displayAllVisits,
        generateUpcomingVisitsHTML: _generateUpcomingVisitsHTML,
        getNextDaysLocations: _getNextDaysLocations,
        mapUpcomingVisits: _mapUpcomingVisits,
        displayAddVisitForm: _displayAddVisitForm,
        formatDate: _formatDate
    };
})();
