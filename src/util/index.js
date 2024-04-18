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