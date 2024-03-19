export module Util {
    export const goToPage = (page: string) : void => {
        window.location.replace(page)
    }

    export const goToHome = () : void => {
        goToPage("/")
    }

    export const getPageLocation = () : string => {
        return getPageData(1)
    }

    export const getPageDir = () : string => {
        return getPageData(2)
    }

    export const pageDirIsMK8 = () : boolean => {
        return pageDirIs('mk8')
    }

    export const pageDirIsPlayer = () : boolean => {
        return pageDirIs('player')
    }

    export const onMK8RaceList = () : boolean => {
        return window.location.pathname === "/mk8"
    }
}

const getPageData = (dirLevel: number) : string => {
    const split: string[] = String(window.location).split("/")
    return split[split.length - dirLevel].split("+").join(' ')
}

const pageDirIs = (dir: string) : boolean => {
    return Util.getPageDir() === dir
}