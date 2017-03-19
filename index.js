const GITHUB = 'https://github.com/maijz128/bilibili-index-icon';
const URL = 'index-icon.json';  //https://www.bilibili.com/index/index-icon.json
const ZIP = 'https://github.com/maijz128/bilibili-index-icon/archive/icon.zip';

var jsonObj = {};
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
    $scope.jsonObj = {};
    $scope.formatURL = gFormatURL;
    $http.get(URL).then(function (response) {
        $scope.jsonObj = response.data;
        jsonObj = response.data;
        console.log('fix count: %i', $scope.jsonObj['fix'].length);
    });
});

window.onload = function () {
    var logo = document.getElementById("logo");
    var github = document.getElementById("github");
    var download = document.getElementById("download");

    logo.addEventListener('click', function () {
        location.reload(true);
    });

    github.addEventListener('click', function () {
        window.open(GITHUB);
    });

    download.addEventListener('click', function () {
        window.open(ZIP);
    })
};

var gFormatURL = function (iconURL) {
    var head = iconURL.substr(0, 4);
    if (head.toLowerCase() != 'http') {
        return 'http:' + iconURL;   // iconURL --> "//activity.hdslb.com/blackboard/cover/activity-4151/planet.gif"
    } else {
        return iconURL;
    }
};