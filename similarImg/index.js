/**
 * 缩放图片,输出canvas
 */
function imgResize2Canvas(img, width, height) {
    if (!img || !width) return img

    height = height || width
    // 按比例缩放原图
    const detImg = img.width / img.height
    if (width / height > detImg) {
        height = width / detImg
    } else {
        width = height * detImg
    }
    // 新建 canvas 画到 canvas 中
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height)
    return canvas
}

/**
 * 将canvas处理成灰度图
 */
function grayscaleCanvas(canvas) {
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    const canvasData = ctx.getImageData(0, 0, width, height)
    const canvasDataWidth = canvasData.width

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            // Index of the pixel in the array
            const index = (x + y * canvasDataWidth) * 4
            const R = canvasData.data[index + 0]
            const G = canvasData.data[index + 1]
            const B = canvasData.data[index + 2]

            // calculate gray scale value
            const gray = ~~(R * 0.3 + G * 0.59 + B * 0.11)

            // assign gray scale value
            canvasData.data[index + 0] = gray // Red
            canvasData.data[index + 1] = gray // Green
            canvasData.data[index + 2] = gray // Blue
            canvasData.data[index + 3] = 255  // Alpha
        }
    }
    ctx.putImageData(canvasData, 0, 0)
    return canvasData
}

/**
 * 获取区域内平均灰度值
 * 
 * @param {canvasData} canvas 数据详情 
 */
function averageGary(canvasData,size) {
    if (!canvasData) return null
    const { width, height, data } = canvasData
    let totalGray = 0
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            // Index of the pixel in the array
            const index = (x + y * width) * 4
            const grayValue = data[index]
            totalGray += grayValue
        }
    }
    return totalGray / (size * size);
}
/**
 * 比较像素灰度, 形成 hash 值为图片指纹
 * 
 * @param {canvasData} canvas 数据详情 
 * @param {meanGray} meanGray 区域平均灰度值
 */
function comparePixelGary(canvasData, meanGray) {
    if (!canvasData) return 

    const { width, height } = canvasData
    let compareArray = []

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            // Index of the pixel in the array
            const index = (x + y * width) * 4
            // 图片设置灰度之后， rgb 三值相同，只取其中一值便可
            const grayValue = canvasData.data[index]
            compareArray.push(grayValue >= meanGray ? 1 : 0)
        }
    }
    return compareArray
}

/**
 * 计算图片的hash值
 */
function hash(img) {
    const size = 8;
    const resizedCanvas = imgResize2Canvas(img, size, size)
    const canvasData = grayscaleCanvas(resizedCanvas)
    const meanGray = averageGary(canvasData, size)
    const imgFinger = comparePixelGary(canvasData, meanGray)
    return imgFinger.join('')
}

// 计算汉明距离
function hanming(h1, h2) {
    let diff = 0
    for (let i = 0; i < h1.length; i++) {
        diff += h1[i] ^ h2[i]
    }
    return diff
}

// 对比相似度
function isSimilar(img1, img2) {
    const h1 = hash(img1)
    const h2 = hash(img2)
    const threshHold = 10
    const hanmingDiff = hanming(h1, h2)
    return hanmingDiff < threshHold
}

// 对比相似度
function showHanMing(img1, img2) {
    const h1 = hash(img1)
    const h2 = hash(img2)
    return hanming(h1, h2);
}