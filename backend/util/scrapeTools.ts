import fetch from "cross-fetch";
import { parse as parseHtml, HTMLElement } from "node-html-parser";
import db from "../db/db";

const removeYouTubeLinksFromArray = (a: string[]): string[] =>
    a.filter(i => !i.includes("youtube.com/") && !i.includes("youtu.be/"));

const removeDuplicatesFromArray = <T>(arr: T[]): T[] =>
    arr.filter((value, index) => arr.indexOf(value) === index);

const isNumber = (value: any): boolean => typeof value === 'number' && isFinite(value);

async function fetchHTML(url: string): Promise<string> {
    const res: Response = await fetch(url);
    if (res.status >= 400) {
        throw new Error("Bad response from server");
    }

    const html: string = await res.text();
    if (!html) {
        throw new Error("Error getting HTML.");
    }

    return html;
}

interface RaceRecord {
    race: string;
    raceID: number;
    cup: string | null;
    cc: string;
    date: string;
    player: string;
    days: string;
    lap1: string;
    lap2: string;
    lap3: string;
    coins: string;
    shrooms: string;
    character: string;
    kart: string;
    tires: string;
    glider: string;
    controller: string;
    time: string;
    video_url: string | number;
    nation: string | number;
}

const getRaceRecords = async (raceURL: string, game: string, raceID: number): Promise<RaceRecord[]> => {
    const getCellContent = (cell_count: number, matchingCell: number, cell: HTMLElement, rowVal: string): string => {
        return (cell_count === matchingCell) ? cell.textContent.trim() : rowVal;
    };

    try {
        const html: string = await fetchHTML(raceURL);
        const htmlEl = parseHtml(html);
        const race = htmlEl.querySelectorAll('h2')[0].textContent;
        const cup = raceURL.includes("&cup=") ? raceURL.split("&cup=")[1] : null;
        const cc = raceURL.includes("&m=200") ? "200cc" : "150cc";
        const table = htmlEl.querySelectorAll('table')[2];
        const tableRows = table.querySelectorAll('tr');
        const characterCell: number = game !== 'mkwii' ? 10 : 8;
        const kartCell: number = game !== 'mkwii' ? 11 : 9;
        const durationCell: number = game !== 'mkwii' ? 4 : 11;
        const nationCell: number = game !== 'mkwii' ? 3 : 4;

        const rows = tableRows.slice(1).map(tableRow => {
            let row: Partial<RaceRecord> = { race, raceID, cup, cc };
            let cellCount = 0;
            for (const cell of tableRow.querySelectorAll('td')) {
                row['date'] = getCellContent(cellCount, 0, cell, row.date || '');
                row['player'] = getCellContent(cellCount, 2, cell, row.player || '');
                row['days'] = getCellContent(cellCount, durationCell, cell, row.days || '');
                row['lap1'] = getCellContent(cellCount, 5, cell, row.lap1 || '');
                row['lap2'] = getCellContent(cellCount, 6, cell, row.lap2 || '');
                row['lap3'] = getCellContent(cellCount, 7, cell, row.lap3 || '');
                row['coins'] = (game !== 'mkwii'
                    ? getCellContent(cellCount, 8, cell, row.coins || '')
                    : '');
                row['shrooms'] = (game !== 'mkwii'
                    ? getCellContent(cellCount, 9, cell, row.shrooms || '')
                    : '');
                row['character'] = getCellContent(cellCount, characterCell, cell, row.character || '');
                row['kart'] = getCellContent(cellCount, kartCell, cell, row.kart || '');
                row['tires'] = getCellContent(cellCount, 12, cell, row.tires || '');
                row['glider'] = (game !== 'mkwii'
                    ? getCellContent(cellCount, 13, cell, row.glider || '')
                    : '');
                row['controller'] = (game === 'mkwii'
                    ? getCellContent(cellCount, 10, cell, row.controller || '')
                    : row.controller || '');

                if (cellCount === 1) {
                    const el = parseHtml(cell.innerHTML);
                    const a_el = el.querySelector('a');
                    const img_el = el.querySelector('img');
                    const rawAttrs = a_el ? a_el.rawAttrs : null;
                    const rawAttrsImg = img_el ? img_el.rawAttrs : null;
                    row['time'] = cell.textContent.trim();
                    row['video_url'] = rawAttrs ? rawAttrs.split('"')[1].trim() : 0;
                    row['controller'] = rawAttrsImg ? rawAttrsImg.split('"')[1].trim() : "default";
                } else if (cellCount === nationCell) {
                    const el = parseHtml(cell.innerHTML);
                    const img_el = el.querySelector('img');
                    const rawAttrsImg = img_el ? img_el.rawAttrs : null;
                    row['nation'] = rawAttrsImg ? rawAttrsImg.split('"')[1].trim() : 0;
                }
                cellCount++;
            }
            const dateStr: string = String(row.date);
            const dateIsNan = isNaN(new Date(dateStr).getTime());
            row['date'] = (!dateIsNan) ? row['date'] : '0: ' + row['date'];
            return row as RaceRecord;
        });

        return rows.filter(value => Object.keys(value).length !== 0);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export async function getAndInsertRecords(raceURL: string, table: string, raceID: number): Promise<void> {
    try {
        console.log("Fetching records at URL: " + raceURL);

        // If raceID is null, determine it from the race name + getRaceIdByRaceName.
        if (raceID === null) {
            let raceName: string = raceURL.split("?track=")[1].split("+").join(' ').trim()
            raceName = (raceName.endsWith('&m=200')) ? raceName.slice(0, -6) : raceName
            raceID = await db.getRaceIdByRaceName(table, raceName)
            if (!isNumber(raceID)) {
                return;
            }
        }

        const tableExists: boolean = await db.checkIfTableExists(table);
        if (!tableExists) {
            await db.createTable(table);
        }

        const rows: RaceRecord[] = await getRaceRecords(raceURL, table, raceID);
        for (const row of rows) {
            await db.insertEntry({...row}, table);
        }

        console.log("Done inserting...");
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function scrapeAllRacesByGame(game: string, deleteTable: boolean, startingRaceID: number): Promise<void> {
    console.log("Scraping " + game)

    if (deleteTable) {
        await db.deleteTable(game)
    }

    let raceID: number = game === 'mk8dx' ? 1.01 : 1
    const raceUrls: string[] = await getRaceURLs(game);
    console.log(raceUrls)
    for (const url of raceUrls) {
        if (raceID >= startingRaceID) {
            await getAndInsertRecords(url, game, Math.floor(raceID))
        }
        raceID = raceID + (game === 'mk8dx' ? 0.5 : 1)
    }
}
async function getMKWiiUrls(): Promise<string[]> {
    return new Promise(async (resolve) => {
        const html = parseHtml(await fetchHTML('https://mkwrs.com/mkwii/'))
        const wrTables = html.querySelectorAll('.wr');
        let raceURLs = []
        for (const wrTable of wrTables) {
            const tableRows = wrTable.querySelectorAll('tr').slice(1) // Remove header row
            for (const tableRow of tableRows) {
                const tableDataCells = tableRow.querySelectorAll('td')
                const linkCell = tableDataCells[0]
                if (linkCell) {
                    const link: HTMLElement | null = linkCell.querySelector('a');
                    if (link && '_rawAttrs' in link && 'href' in link.attrs) {
                        let href = "https://mkwrs.com/mkwii/" + link.attrs.href
                        raceURLs.push(href)
                    }
                }
            }
        }
        resolve(raceURLs)
    })
}

export async function getRaceURLs(game: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
        if (game === "mkwii") {
            resolve(await getMKWiiUrls());
        }
        let raceURLs: string[] = [];
        const base_url: string = `https://mkwrs.com/${game}/`;
        const html: string = await fetchHTML(base_url);
        if (!html)
            reject("Error getting HTML.")
        const tables = parseHtml(html).querySelectorAll('table')
        const table_els = [tables[0], tables[1]]
        for (const table of table_els) {
            let tr_count = 0
            for (const tr of table.querySelectorAll('tr')) {
                const track_cell = tr.querySelectorAll('td')[0]
                if (track_cell) {
                    const a_el = track_cell.querySelector('a')
                    if (a_el) {
                        let cup = null;
                        if (a_el.innerHTML.includes('src="cups/')) {
                            let cup_data = a_el.innerHTML.split('src="cups/')[1].trim()
                            cup_data = cup_data.split(".webp")[0].trim()
                            const cup_first_letter_capitalized = cup_data.charAt(0).toUpperCase() + cup_data.slice(1)
                            cup = cup_first_letter_capitalized + ' '
                        }
                        console.log(cup)
                        const raceURL = base_url + a_el.rawAttrs.split('"')[1].trim() + "&cup=" + cup
                        raceURLs.push(raceURL)
                    }
                }
            }
        }
        if (!Array.isArray(raceURLs)) {
            reject("Not array")
        }
        resolve(removeYouTubeLinksFromArray(removeDuplicatesFromArray(raceURLs)))
    })
}
