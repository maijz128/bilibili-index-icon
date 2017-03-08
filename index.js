const GITHUB = 'https://github.com/maijz128/bilibili-index-icon';
const URL = 'index-icon.json';

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
    var downloadInfo = document.getElementById("download-info");
    var download = document.getElementById("download");

    logo.addEventListener('click', function () {
        location.reload(true);
    });

    github.addEventListener('click', function () {
        window.open(GITHUB);
    });

    function showDownloadInfo() {
        downloadInfo.style.visibility = 'visible';
    }

    function hideDownloadInfo() {
        downloadInfo.style.visibility = 'hidden';
    }

    function httpReplaceHttps(url) {
        return gFormatURL(url);
    }

    download.addEventListener('click', function () {
        var zip = new JSZip();
        var count = jsonObj['fix'].length;

        var nowDate = new Date();
        var nowTime = nowDate.getFullYear() + '-' + nowDate.getMonth() + '-' + nowDate.getDate();
        var ZIP_FILE_NAME = nowTime + '-bilibili-index-icon-' + count + '.zip';

        var i = 0;

        showDownloadInfo();

        jsonObj['fix'].forEach(function (obj) {
            var fileName = obj['title'] + '.gif';
            var imgUrl = httpReplaceHttps(obj['icon']);

            function downloadImg(err, data) {
                i++;
                if (err) {
                    throw err; // or handle the error
                } else {
                    downloadInfo.innerHTML = 'Download >> ' + fileName;
                    zip.file(fileName, data, {binary: true});
                }
            }

            // loading a file and add it in a zip file
            JSZipUtils.getBinaryContent(imgUrl, downloadImg);
        });
        var timer = setInterval(function () {
            if (i === count) {
                clearInterval(timer);
                hideDownloadInfo();
                zip.generateAsync({type: "blob"})
                    .then(function (content) {
                        // see FileSaver.js
                        saveAs(content, ZIP_FILE_NAME);
                        console.log("save zip file.");
                    });
            }
        }, 500);
        setInterval(function () {
            clearInterval(timer);
            hideDownloadInfo();
            console.log('自动取消侦听。')
        }, 30000);
    });
};

var gFormatURL = function (iconURL) {
    var head = iconURL.substr(0, 4);
    if (head.toLowerCase() != 'http') {
        return 'http:' + iconURL;   // iconURL --> "//activity.hdslb.com/blackboard/cover/activity-4151/planet.gif"
    } else {
        return iconURL;
    }
};