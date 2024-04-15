window.onload = function () {
    $( "button" ).on( "click", function() {
        var url = document.URL + '/button/' + $(this).value + '/press';
        console.log('Pressing button: ' + url);

        $.getJSON(url, function (data) {
            console.log('API response received: ' + JSON.stringify(data));
        });
    } );


}; //onload