const video2Char = {
    init() {
        this.video = document.getElementById('video') // 视屏播放区域
        this.preview = document.getElementById('preview') // 字符显示区域
        this.canvas = document.createElement('canvas')
        this.showBtn = document.getElementById('showBtn') //显示按钮
        this.uploadFile = document.getElementById('uploadFile') //上传视屏文件
        this.timeout = null // 计时器

        this.eventBind()
    },
    eventBind() {
        const {
            showBtn,
            video
        } = this
        showBtn.addEventListener('click', video2Char.videoPlay.bind(this))
        video.addEventListener('play', video2Char.beginCapture.bind(this))
        video.addEventListener('pause', video2Char.endCapture.bind(this))
        video.addEventListener('ended', video2Char.endCapture.bind(this))
        video.addEventListener('playing', video2Char.beginCapture.bind(this))
    },
    getImage() {
        const {
            videoWidth: w,
            videoHeight: h
        } = this.video
        this.canvas.width = w
        this.canvas.height = h
        if (w) {
            const ctx = this.canvas.getContext('2d')
            ctx.clearRect(0, 0, w, h)
            ctx.drawImage(this.video, 0, 0, w, h)
            this.preview.innerText = img2char.toChars(ctx, w, h, 100)
        }
    },
    beginCapture() {
        this.endCapture()
        this.timeout = this.mySetInterval(() => {
            this.getImage()
        }, 16.7)
    },
    endCapture() {
        if (this.timeout) {
            this.myClearInterval(this.timeout)
        }
    },
    videoPlay() {
        const {
            files
        } = this.uploadFile
        const file = files && files[0]
        if (!file) {
            alert("请先选择文件");
        }
        const url = URL.createObjectURL(file)
        this.video.src = url
        this.video.play()
    },
    mySetInterval(callback, time, ...args) {
        const set = (callback, time, ...args) => {
            return () => {
                let start = +new Date()
                let end = start
                while (end - start < time) {
                    end = +new Date()
                }
                callback(...args)
                this.timeout = requestAnimationFrame(set(callback, time, ...args))
            }
        }
        set(callback, time, ...args)()
    },
    myClearInterval(timeout) {
        cancelAnimationFrame(timeout)
    }
}

video2Char.init()