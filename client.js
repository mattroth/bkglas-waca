window.onload = function () {
    $( "button" ).on( "click", function() {
        var url = document.URL + '/button/' + $(this).value + '/press';
        console.log('Pressing button: ' + url);

        $.getJSON(url, function (data) {
            console.log('API response received: ' + JSON.stringify(data));
        });
    } );


    /**
    var url,
        i,
        ports = [23, 25];  // the GPIO ports we will read

    for (i in ports) {
        $('#input_' + ports[i]).html('loading port ' + ports[i] + ' value...');
    }

    setInterval( function () {
        for (i in ports) {
            url = document.URL + 'inputs/' + ports[i];
            console.log('making API call ' + url);

            $.getJSON(url, function (data) {
                console.log('API response received. port ' + data.gpio + ' value = ' + data.value);
                $('#input_' + data.gpio).html('GPIO input port ' + data.gpio + ' value is ' + data.value);
            });
        } // for
    }, 1000); // setInterval
     **/

}; //onload