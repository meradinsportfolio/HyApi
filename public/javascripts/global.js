
// Userlist data array for filling in info box
var locationListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    $('#locationList table tbody').on('click', 'td a.linkshowlocation', showLocationInfo);

    $('#btnAddLocation').on('click', addLocation);

    $('#locationList table tbody').on('click', 'td a.linkdeletelocation', deleteLocation);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';


    // jQuery AJAX call for JSON
    $.getJSON( '/admin/pokemons', function( data ) {
        locationListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.pid + '</td>';
            tableContent += '<td><a href="#" class="linkshowlocation" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.lat + '</td>';
            tableContent += '<td>' + this.lng + '</td>';
            tableContent += '<td><a href="#" class="linkdeletelocation" rel="' + this.pid + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#locationList table tbody').html(tableContent);
    });
};

function showLocationInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisPokemonId = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = locationListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisPokemonId);

    // Get our User Object
    var thisLocationObject = locationListData[arrayPosition];

    //Populate Info Box
    $('#locationInfoPid').text(thisLocationObject.pid);
    $('#locationInfoName').text(thisLocationObject.name);
    $('#locationInfoLat').text(thisLocationObject.lat);
    $('#locationInfoLng').text(thisLocationObject.lng);
}

function addLocation(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addLocation input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newLocation = {
            'pid': $('#addLocation fieldset input#inputLocationPid').val(),
            'name': $('#addLocation fieldset input#inputLocationName').val(),
            'lat': $('#addLocation fieldset input#inputLocationLat').val(),
            'lng': $('#addLocation fieldset input#inputLocationLng').val(),
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newLocation,
            url: '/admin/pokemons/addlocation',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addlocation fieldset input').val('');

                // Update the table
                populateTable();

                console.log('refreshed the location set');
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteLocation(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this loation?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/admin/pokemons/deletelocation/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};