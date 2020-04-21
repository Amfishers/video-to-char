/**
 * Created by Fisher on 2019/08/08.
 */

const img2char = {
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
            char_w = char_h, // 字符按照正方形来计算
            rows = height / char_h,
            cols = rowChars
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let pos_x = ~~(c * char_h), // 对应当前图片的 X 位置
                    pos_y = ~~(r * char_h), // 对应当前图片的 Y 位置
                    avg = _this.getBlockGray(pos_x, pos_y, ~~char_w, ~~char_h, imageData),
                    ch = map[avg]
                output += ch
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
}
