


export module Util {

    export function onRacePage() {
        return pageDirIsMK8OrMK8DX() || pageDirIs('mk7');
    }

    export const onTrackList = () => Util.onMK8RaceList() || Util.onMK8DXRaceList() || Util.onMK7RaceList();

    const getPageData = (dirLevel: number) : string => {
        const split: string[] = String(window.location).split("/")
        return split[split.length - dirLevel].split("+").join(' ')
    }

    const pageDirIs = (dir: string) : boolean => getPageDir() === dir

    const pageLocIs = (loc: string) : boolean => getPageLocation() === loc

    export const getPageLocation = () : string => {
        return getPageData(1)
    }

    export const getPageDir = () : string => getPageData(2)

    export const pageDirIsMK8 = () : boolean => {
        return pageDirIs('mk8')
    }

    export const pageDirIsMK8DX = () : boolean => {
        return pageDirIs('mk8dx') && !pageLocIs('200cc')
    }

    export const pageDirIsMK8OrMK8DX = () : boolean => {
        if (pageLocIs('200cc')) {
            return getPageData(3) === 'mk8dx'
        }
        return pageDirIsMK8() || pageDirIsMK8DX()
    }

    export const pageDirIsPlayer = () : boolean => {
        return pageDirIs('player')
    }

    export const onMK7RaceList = () : boolean => {
        return pathIs("/mk7")
    }

    export const onMK8RaceList = () : boolean => {
        return pathIs("/mk8");
    }

    export const onMK8DXRaceList = () : boolean => {
        return pathIs("/mk8dx") || pathIs("/mk8dx/200cc");
    }

    export const goToPage = (page: string) : void => {
        window.location.replace(page);
    }

    export const getRaceName = (): string => {
        if (pageLocIs('200cc')) {
            return getPageDir();
        }
        return getPageLocation();
    };

    export function getPath(): string {
        return window.location.pathname;
    }

    export const pathIs = (path: string): boolean => {
        return getPath() === path;
    }

    export const prepareURL = (url: string): string => {
        return url.replace(/ /g, "+");
    }
}