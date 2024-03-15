export module Util {
    export const getPageLocation = () => {
        const split = String(window.location).split("/")
        return split[split.length - 1].split("+").join(' ')
    }
}