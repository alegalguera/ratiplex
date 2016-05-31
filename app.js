

angular.module('MyApp', ['ngMaterial'])
    .controller("MainController", MainController);

function MainController($http,$scope){

var _this = this;
var token = "";

_this.films = [];

var User = "",
    Pass = "",
    // _url = 'https://plex.tv/users/sign_in.json';
    _url = '';


    _this.Server_info_url = 'https://plex.tv/pms/servers';
    _this._films_url = 'http://174.61.32.70:32400/library/sections/5/all?X-Plex-Token=';




    var client = {
      Product:"Plex Web",
      Identifier:btoa(Math.random(3,3)),
      Version:"2.6.1"
    };




    _this.login = function() {
        _this.User = $scope.clientName;
        _this.Pass = $scope.clientPass;
        _this.submit_login();
    };



_this.submit_login = function() {

  $http({
    method: 'POST',
    url: _url,
    headers: {
        'X-Plex-Product': client.Product,
        'X-Plex-Client-Identifier': client.Identifier,
        'X-Plex-Version': client.Version,
        'Authorization': "Basic " + btoa(_this.User+":"+_this.Pass),
        'Accept': 'application/json'
            }
    })
    .success(function(data, status) {
  _this.getServer();
  $scope.searchContainer = true;
  $scope.loginContainer = true;
      console.log(status);
      if (status == 201) {
          $scope.searchContainer = true;
        //  console.log(data.user);
          _this.token = data.user.authentication_token;
          _this.responseText = "Hello " + data.user.username;
          // _this.getServer();
      }
        })
        .error(function(data, status) {
          console.error('Repos error', status, data);
            _this.responseText = data.error;
        });

}

_this.getServer = function() {

   console.log("getting...." + _this.Server_info_url);
    $http({
        method: 'GET',
        // url: _this.Server_info_url + "?X-Plex-Token=" + _this.token,
        url: "test.xml",
        headers: {
            'Accept': 'application/json'
        }
    }).then(function successCallback(response) {
        //  console.log(response.data);

        if (window.DOMParser)
          {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(response.data, "text/xml");
          }
        else // Internet Explorer
          {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(response.data);
          }

          //console.log(xmlDoc.getElementsByTagName("Video")[0].getAttribute("title"));


for (var i = 0; i <  xmlDoc.childNodes[0].getAttribute("size"); i++) {

  if(xmlDoc.getElementsByTagName("Video")[i])
      //  console.log(xmlDoc.getElementsByTagName("Video")[i].getAttribute("title"));
        _this.films.push({
          "title":xmlDoc.getElementsByTagName("Video")[i].getAttribute("title"),
          "ratingKey":xmlDoc.getElementsByTagName("Video")[i].getAttribute("ratingKey"),
          "studio":xmlDoc.getElementsByTagName("Video")[i].getAttribute("studio"),
          "type":xmlDoc.getElementsByTagName("Video")[i].getAttribute("type"),
          "contentRating":xmlDoc.getElementsByTagName("Video")[i].getAttribute("contentRating"),
          "summary":xmlDoc.getElementsByTagName("Video")[i].getAttribute("summary"),
          "rating":xmlDoc.getElementsByTagName("Video")[i].getAttribute("rating"),
          "year":xmlDoc.getElementsByTagName("Video")[i].getAttribute("year"),
          "thumb":xmlDoc.getElementsByTagName("Video")[i].getAttribute("thumb"),
          "duration":xmlDoc.getElementsByTagName("Video")[i].getAttribute("duration"),

        });
}

            // xmlDoc.childNodes[0].getAttribute("size")

    }, function errorCallback(response) {
        console.error(response);
    });
};


  _this.selectFilm = function(index) {
      _this.selectedFilm = _this.films[index];
  }




}
