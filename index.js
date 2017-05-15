const GITHUB = 'https://github.com/maijz128/bilibili-index-icon';
const INDEX_URL = 'https://www.bilibili.com/index/index-icon.json';
const ONLINE_INDEX_URL = 'index-icon.json';
const ZIP = 'https://github.com/maijz128/bilibili-index-icon/archive/icon.zip';

var appData = {
    jsonObj: {}
};
var app = null;


window.onload = function () {
    Vue.use(VueLazyload);

    app = new Vue({
        el: '#wrapper',
        data: appData,
        methods: {
            reload: function () {
                location.reload(true);
            },
            toGithub: function () {
                window.open(GITHUB);
            },
            formatURL: gFormatURL,
            download: function () {
                if (isOnline()) {
                    window.open(ZIP);
                } else {
                    this.downloadIndexJSON();
                    new Downloader(appData.jsonObj).start();
                }
            },

            downloadIndexJSON: function () {
                const fileName = 'index-icon.json';
                const jsonString = JSON.stringify(appData.jsonObj);
                const blob = new Blob([jsonString], {type: "text/plain;charset=utf-8"});
                saveAs(blob, fileName);
            }
        }
    });

    const url = isOnline() ? ONLINE_INDEX_URL : INDEX_URL;
    fetch(url).then(function (response) {
        return response.json();

    }).then(function (json) {
        appData.jsonObj = json;
        console.log('fix count: %i', appData.jsonObj['fix'].length);
    });
};

function Downloader(jsonObj) {
    const self = this;

    self.downloadInfo = document.getElementById("download-info");
    self.jsonObj = jsonObj;
    self.fixCount = jsonObj['fix'].length;

    self.zip = new JSZip();
    self.ZIP_FILE_NAME = getDate() + '-bilibili-index-icon-' + self.fixCount + '.zip';
    self.currentDownloadCount = 0;

}
Downloader.prototype.start = function () {
    const self = this;
    if (self.currentDownloadCount >= self.fixCount) return;

    self.downloadInfo.style.visibility = 'visible';
    self.jsonObj['fix'].forEach(function (obj) {
        const fileName = obj['id'] + '-' + obj['title'] + '.gif';
        const imgUrl = gFormatURL(obj['icon']);

        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(imgUrl, function (err, data) {
            self.currentDownloadCount++;
            if (err) {
                console.error(err); // or handle the error
            } else {
                self.downloadImg(data, fileName);
            }
            if (self.currentDownloadCount >= self.fixCount) {
                self.done();
            }
        });
    });
};
Downloader.prototype.downloadImg = function (data, fileName) {
    const self = this;
    self.downloadInfo.innerHTML = 'Download >> ' + fileName;
    self.zip.file(fileName, data, {binary: true});
};
Downloader.prototype.done = function () {
    const self = this;
    self.downloadInfo.style.visibility = 'hidden';
    self.zip.generateAsync({type: "blob"}).then(function (content) {
        // see FileSaver.js
        saveAs(content, self.ZIP_FILE_NAME);
        console.log("save zip file.");
    });
};


function isOnline() {
    const isHttp = window.location.protocol === 'http:' || window.location.protocol === 'https:';
    const hasGithub = window.location.href.indexOf('github.io');
    return isHttp && hasGithub;
}

function getDate() {
    var nowDate = new Date();
    var y = nowDate.getFullYear();
    var m = parseInt(nowDate.getMonth()) + 1;
    var d = nowDate.getDate();
    return y + '-' + m + '-' + d;
}

function gFormatURL(iconURL) {
    var head = iconURL.substr(0, 4);
    if (head.toLowerCase() !== 'http') {
        return 'http:' + iconURL;   // iconURL --> "//activity.hdslb.com/blackboard/cover/activity-4151/planet.gif"
    } else {
        return iconURL;
    }
}