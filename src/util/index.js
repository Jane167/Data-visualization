/**
 * @description 生成 min ~ max 之间的随机数
 * @param min
 * @param max
 * @return {*}
 */
export const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @description 随机生成一个 boolean 值
 * @return {number}
 */
export const getRandomBoolean = () => {
    return Math.random() >= 0.5 ? 1 : 0;
}


/**
 * @description 数组排序, 先字母, 后数字
 * @param {Array} array arr: ['A5', 'A11', 'A1'， 'A3']
 * @param {Boolean} isObj 是否是对象数组
 * @param {String} field 对象数组的排序字段
 * @returns arr: ['A3', 'A4', 'A5'， 'A11']
 */
export const sortByCharacter = (array, isObj, field) => {
    return array.sort((a, b) => {
        if (isObj) {
            return a[field].localeCompare(b[field], 'zh-CN', {numeric: true})
        } else {
            return a.localeCompare(b, 'zh-CN', {numeric: true})
        }
    })
}




