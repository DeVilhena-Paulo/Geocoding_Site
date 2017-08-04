// Event handling
document.addEventListener("DOMContentLoaded",
  function (event) {

    function show_marker(infowindow, position, map) {
      var marker = new google.maps.Marker({
        title: 'Geocoding Result',
        map: map,
        position: position
      });

      google.maps.event.addListener(marker, 'click',
        function() {
          infowindow.open(map, marker);
        });
    }

    function search() {
      var code = document.getElementById("code").value;
      var commune = document.getElementById("commune").value;
      var adresse = document.getElementById("adresse").value;
      var checked = document.getElementById("switch").checked;

      this.blur();

      if (checked) {
        position_search(code, commune, adresse);
      }
      else {
        voie_search(code, commune, adresse);
      }

    }

    function voie_search(code, commune, adresse) {
      var url = "http://localhost:8080/voie/" + code + "&" + commune + "&"
                 + adresse;
      $ajaxUtils.sendGetRequest(url,
        function (res) {
          var myLatLng = {lat: res.latitude, lng: res.longitude};

          if (myLatLng.lat == "" && myLatLng.lng == "") return;

          var zoom = (res.quality == 4) ? 15 : 17;

          var map = new google.maps.Map(document.getElementById('map'), {
            zoom: zoom,
            center: myLatLng
          });

          if ('voie_nums' in res) {
            for (var i = 0; i < res.voie_nums.length; i++) {
              var num = res.voie_nums[i];

              var infowindow = new google.maps.InfoWindow({
                content: '<b> Geocoding Result </b><br>' +
                         'Number : ' + num.numero + '<br>' +
                         + num.longitude + ', '
                         + num.latitude + '<br>',
                size: new google.maps.Size(150, 50)
              });

              var position = {lat: num.latitude,
                              lng: num.longitude};

              show_marker(infowindow, position, map);
            }
          }
        });
    }

    function position_search(code, commune, adresse) {
      var url = "http://localhost:8080/position/" + code + "&" + commune + "&"
               + adresse;

      $ajaxUtils.sendGetRequest(url,
        function (res) {
          var myLatLng = {lat: res.latitude, lng: res.longitude};

          if (myLatLng.lat == "" && myLatLng.lng == "") return;

          var zoom = (res.quality == 4) ? 15 : 18;

          var map = new google.maps.Map(document.getElementById('map'), {
            zoom: zoom,
            center: myLatLng
          });

          var infowindow = new google.maps.InfoWindow({
            content: '<b> Geocoding Result </b><br>' +
                     'Time : ' + res.duration.toFixed(5) + '<br>' +
                     'Search status : ' + res.status + '<br>' +
                     + res.longitude + ', '
                     + res.latitude + '<br>',
            size: new google.maps.Size(150, 50)
          });

          show_marker(infowindow, myLatLng, map);
        });

    }
    // Unobtrusive event binding
    document.querySelector("#search-button")
      .addEventListener("click", search);

    // Unobtrusive event binding
    document.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            document.getElementById("search-button").click();
        }
    });
  }
);





