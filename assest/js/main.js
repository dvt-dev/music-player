/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Scrool active song into view
 * 9. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');



const app = {
  currentIndex:0,  
  isPlaying: false,
  isRandom: false,
  isRepeat : false,
  isActive: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "An thần",
      singer: "Low G",
      path: "./assest/music/anthan.mp3",
      image: "./assest/img/anthan.jpg",
    },
    {
      name: "Càng cua",
      singer: "Low G",
      path: "./assest/music/cangcua.mp3",
      image: "./assest/img/cangcua.jpg",
    },
    {
      name: "Chán gái 707",
      singer: "Low G",
      path: "./assest/music/changai707.mp3",
      image: "./assest/img/changai707.jpg",
    },
    {
      name: "Dáng xinh",
      singer: "Low G",
      path: "./assest/music/dangxinh.mp3",
      image: "./assest/img/dangxinh.jpg",
    },
    {
      name: "Đơn giản",
      singer: "Low G",
      path: "./assest/music/dongian.mp3",
      image: "./assest/img/dongian.jpg",
    },
    {
      name: "Flexin trên circle K",
      singer: "Low G",
      path: "./assest/music/flexintrencircleK.mp3",
      image: "./assest/img/flexintrencircleK.jpg",
    },
    {
      name: "Tán gái 505",
      singer: "Low G",
      path: "./assest/music/tangai505.mp3",
      image: "./assest/img/tangai505.jpg",
    },
    {
      name: "Tán gái 606",
      singer: "Low G",
      path: "./assest/music/tangai606.mp3",
      image: "./assest/img/tangai606.jpg",
    },
    {
      name: "Thủ đô Cypher",
      singer: "RPT Orijinn, Low G, RZMas, RPT MCK",
      path: "./assest/music/thudocypher.mp3",
      image: "./assest/img/thudocypher.jpg",
    },
    {
      name: "Về nhà ăn tết",
      singer: "Justatee & Bigdaddy",
      path: "./assest/music/venhaantet.mp3",
      image: "./assest/img/venhaantet.jpg",
    },
    {
      name: "Summertime Sadness",
      singer: "Lana Del Rey",
      path: "./assest/music/summertime.mp3",
      image: "./assest/img/summertime.jpg",
    }
  ],

  setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${index === this.currentIndex ? 'active' : '' }" data-index = ${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
    });

    playlist.innerHTML = htmls.join('');
  },

  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
        get: function() {
            return this.songs[this.currentIndex];
        }
    } ) 
  },

  handleEvents: function() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý phóng to / thủ nhỏ CD
    document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth;
    }

    // Xử lý CD Roate
    const cdThumdAnimate = cdThumb.animate([
      {transform : 'rotate(360deg)'}
    ], {
      duration: 10000,
      iterations: Infinity
    })
    cdThumdAnimate.pause();

    // Xử lý khi click play
    playBtn.onclick = function() {
        if(_this.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }  
    }

    // Khi song được play
    audio.onplay = function() {
        _this.isPlaying = true;
        player.classList.add('playing');
        cdThumdAnimate.play();
    }

    // Khi song được pause
    audio.onpause = function() {
        _this.isPlaying = false;
        player.classList.remove('playing');
        cdThumdAnimate.pause();
    }

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function() {
        if(audio.duration) {
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
          progress.value = progressPercent;
        }      
    }

    // Xử lí khi tua song
    progress.oninput = function(e) {
      const seekTime = audio.duration / 100 * e.target.value;
      audio.currentTime = seekTime;
    }

    // Xử lí khi next song
    nextBtn.onclick = function() {
      if(_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }

    // Xử lí khi prev song
    prevBtn.onclick = function() {
      if(_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }

    // Xử lí khi random song
    randomBtn.onclick = function() {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      randomBtn.classList.toggle('active', _this.isRandom);
    }

    // Xử lí repeat song 
    repeatBtn.onclick = function() {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active', _this.isRepeat);
    }

    // Xử lí next song khi audio ended
    audio.onended = function() {
      if(_this.isRepeat) {
        audio.play()
      } else {
        nextBtn.click();
      }
    }

    // Lắng nghe click vào playlist
    playlist.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)');
      if(songNode || e.target.closest('.option')  ) {
        // Xử lí click vào song
        if(songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lí click vào option
        if(e.target.closest('.option')) {

        }
      }
    }
    

  },
   
  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },

  nextSong: function() {
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function() {
    this.currentIndex--;
    if(this.currentIndex < 0 ) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  randomSong: function() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();  
  },

  scrollToActiveSong:function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 100)
    
  },

  loadConfig: function() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  
  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe / xử lí các sự kiện (Dom events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
  },
};

app.start();
