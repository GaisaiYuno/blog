const ap = new APlayer({
    container: document.getElementById('aplayer'),
    showlrc: true,
    fixed: true,
    volume: 0.7,
    listMaxHeight: "400px",
    lrcType: 3,
    //autoplay: true,
    mutex: true,
    audio: [
        {
            name: 'bad apple',
            lrc: 'https://api.i-meto.com/meting/api?server=netease&type=lrc&id=22645196&auth=74719cb140fa465525dcaf12f6ae0971c6990bd1da433aa423015315addb4e4b',
            url: 'https://static.missevan.com/MP3/201604/10/b6d026626fa40f53ee353ebade9f9583180358.mp3',
            cover: 'http://static.missevan.com/coversmini/201604/10/06d04f806396d350541bb1bcec7ddbdf180359.jpg',
            artist: 'のみこ',
        },
    ]
});