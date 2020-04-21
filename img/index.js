/**
 * Created by Fisher on 2019/08/08.
 */

const img2char = {
    init() {
        this.img = new Image()
        this.show = document.getElementById("show") // 显示 pre 字符的容器
        this.canvas = document.createElement("canvas") // 新建 canvas 用于
        this.showBtn = document.getElementById('showBtn') // 点击展示按钮
        this.charCanvas = document.getElementById('charCanvas') // 显示结果的 canvas 容器 
        this.sidebarImg = document.querySelector('.sidebar-img') // 侧边栏显示原图的容齐
        this.uploadFile = document.getElementById('uploadFile') // 上传 input
        this.ctx = this.canvas.getContext('2d')
        this.charCtx = this.charCanvas.getContext('2d')

        this.eventHandler()
    },
    eventHandler() {
        this.fileChangeHandler()
        this.viewStyleSwitch()
    },
    // 显示方式切换
    viewStyleSwitch() {
        const showPre = document.getElementById('showPre')
        const showCanvas = document.getElementById('showCanvas')
        const panelPre = document.querySelector('.panel-pre')
        const panelCanvas = document.querySelector('.panel-canvas')
        showPre.onclick = function () {
            panelPre.style.display = 'block'
            panelCanvas.style.display = 'none'
        }
        showCanvas.onclick = function () {
            panelPre.style.display = 'none'
            panelCanvas.style.display = 'block'
        }
    },
    fileChangeHandler() {
        this.showBtn.addEventListener('click', () => {
            const { files } = this.uploadFile
            const {
                canvas,
                img,
                sidebarImg,
                show,
                ctx,
                charCanvas,
            } = this
            const file = files && files[0]
            if (!file) {
                return alert("请选择展示文件")
            }
            const url = URL.createObjectURL(file)
            img.src = url
            img.onload = () => {
                this.clearFill()
                const {
                    width: imgWidth,
                    height: imgHeight
                } = img
                
                charCanvas.width = canvas.width = imgWidth
                charCanvas.height = canvas.height = imgHeight

                // 画上字符
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight)
                show.innerText = this.toChars(ctx, imgWidth, imgHeight, 100)

                // 在页面插入图片
                // 如果直接 appendChild 会导致图片的尺寸变成 sidebarImg 的大小
                sidebarImg.innerHTML = ''
                sidebarImg.appendChild(img.cloneNode(true))
            }

        })
    },
    /* 核心功能
    * 像素转化为字符
    *
    * this function can convert the image in canvas to a char-picture(string) or canvas
    * cotext:the canvas context;
    * width:the image width;
    * height:the image height; 
    * rowChars:how many chars in one row.
    * 
    */
    toChars(context, width, height, rowChars) {
        const _this = this
        const map = _this.getCharsMap()
        const imageData = context.getImageData(0, 0, width, height)
        rowChars = width < rowChars ? width : rowChars
        let output = '',
            char_h = width / rowChars, // 图片 与 每行字符数的比例，也就是每个字符占图片多少像素
            char_w = char_h,    // 字符按照正方形来计算
            rows = height / char_h,
            cols = rowChars
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let pos_x = ~~(c * char_h), // 对应当前图片的 X 位置
                    pos_y = ~~(r * char_h), // 对应当前图片的 Y 位置
                    avg = _this.getBlockGray(pos_x, pos_y, ~~char_w, ~~char_h, imageData),
                    ch = map[avg]
                output += ch
                // canvas 画布画上字符
                _this.charCtx.fillText(ch, pos_x, pos_y)
            }
            output += '\r\n'
        }
        return output
    },
    // to get a block of pixiels average gray - value.
    // 这里我们预定一个字符为 10*10 像素，所以我们计算这个字符对应图片上的像素区域，然后取平均灰度值
    getBlockGray(x, y, w, h, imageData) {
        let sumGray = 0,
            pixels
        for (let row = 0; row < w; row++) {
            for (let col = 0; col < h; col++) {
                const cx = x + col, //current position x
                    cy = y + row, //current positon y
                    index = (cy * imageData.width + cx) * 4, //current index in rgba data array
                    data = imageData.data,
                    R = data[index],
                    G = data[index + 1],
                    B = data[index + 2],
                    gray = ~~(R * 0.3 + G * 0.59 + B * 0.11)
                sumGray += gray
            }
        }
        pixels = w * h
        return ~~(sumGray / pixels)
    },
    // 灰度映射字符
    getCharsMap() {
        let chars = ['@', 'w', '#', '$', 'k', 'd', 't', 'j', 'i', '.', ' ']
        let map = {}
        for (let i = 0; i < 256; i++) {
            let index = ~~(i / 25)
            map[i] = chars[index]
        }
        return map
    },
    // 清空画布
    clearFill() {
        const {
            width,
            height
        } = this.img
        this.show.innerHTML = ''
        this.charCtx.clearRect(0, 0, width, height)
    },
}

img2char.init()