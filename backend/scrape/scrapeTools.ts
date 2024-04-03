import fetch from "cross-fetch";
import { parse as parseHtml, HTMLElement } from "node-html-parser";
import db from "../db/db";

const removeYouTubeLinksFromArray = (a: string[]): string[] =>
    a.filter(i => !i.includes("youtube.com/") && !i.includes("youtu.be/"));

const removeDuplicatesFromArray = <T>(arr: T[]): T[] =>
    arr.filter((value, index) => arr.indexOf(value) === index);

const isNumber = (value: any): boolean => typeof value === 'number' && isFinite(value);

async function fetchHTML(url: string): Promise<string> {
    try {
        const res = await fetch(url);
        if (res.status >= 400)
            throw new Error("Bad response from server");
        const html = await res.text();
        if (html)
            return html;
        throw new Error("Error getting HTML.");
    } catch (error: any) {
        throw new Error(error.message);
    }
}

interface RaceRecord {
    race: string;
    race_id: number;
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

const getRaceRecords = async (race_url: string, game: string, race_id: number): Promise<RaceRecord[]> => {
    const getCellContent = (cell_count: number, matchingCell: number, cell: HTMLElement, rowVal: string): string => {
        return (cell_count === matchingCell) ? cell.textContent.trim() : rowVal;
    };

    try {
        const html = await fetchHTML(race_url);
        if (!html) {
            throw new Error("Error getting HTML.");
        }

        const htmlEl = parseHtml(html);
        const race = htmlEl.querySelectorAll('h2')[0].textContent;
        const cup = race_url.includes("&cup=") ? race_url.split("&cup=")[1] : null;
        const cc = race_url.includes("&m=200") ? "200cc" : "150cc";
        const table = htmlEl.querySelectorAll('table')[2];
        const tableRows = table.querySelectorAll('tr');
        const characterCell: number = game !== 'mkwii' ? 10 : 8;
        const kartCell: number = game !== 'mkwii' ? 11 : 9;
        const durationCell: number = game !== 'mkwii' ? 4 : 11;
        const nationCell: number = game !== 'mkwii' ? 3 : 4;

        const rows = tableRows.slice(1).map(tableRow => {
            let row: Partial<RaceRecord> = { race, race_id, cup, cc };
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

export async function getAndInsertRecords(race_url: string, table: string, race_id: number): Promise<void> {
    try {
        console.log("Fetching records at URL: " + race_url);
        if (race_id === null) {
            let raceName = race_url.split("?track=")[1].split("+").join(' ')
            if (raceName.endsWith('&m=200')) {
                raceName = raceName.slice(0, -6)
            }
            raceName = decodeURI(raceName.trim())
            const raceID = await db.getRaceIdByRaceName(table, raceName)
            if (isNumber(raceID)) {
                race_id = raceID;
                console.log(`Found race ID: ${race_id}`)
            } else {
                return;
            }
        }
        const rows = await getRaceRecords(race_url, table, race_id);
        console.log("Race records received! Attempting to insert all rows.");
        console.log(rows);
        const tableExists = await db.checkIfTableExists(table);
        if (!tableExists) {
            await db.createTable(table);
        }
        for (const row of rows) {
            try {
                await db.insertEntry({...row}, table);
            } catch (e: any) {
                console.log("Error: " + e.message);
            }
        }
        console.log("Done inserting...");
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function scrapeAllRacesByGame(game: string, deleteTable: boolean, startingRaceID: number): Promise<void> {
    if (deleteTable) {
        await db.deleteTable(game)
    }
    let race_id = game === 'mk8dx' ? 1.01 : 1
    for (const url of await getRaceURLs(game)) {
        if (race_id >= startingRaceID) {
            await getAndInsertRecords(url, game, Math.floor(race_id))
        }
        race_id = race_id + (game === 'mk8dx' ? 0.5 : 1)
    }
}
async function getMKWiiUrls(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
        const html = parseHtml(await fetchHTML('https://mkwrs.com/mkwii/'))
        const wrTables = html.querySelectorAll('.wr');
        let race_urls = []
        for (const wrTable of wrTables) {
            const tableRows = wrTable.querySelectorAll('tr').slice(1) // Remove header row
            for (const tableRow of tableRows) {
                const tableDataCells = tableRow.querySelectorAll('td')
                const linkCell = tableDataCells[0]
                if (linkCell) {
                    const link: HTMLElement | null = linkCell.querySelector('a');
                    if (link && '_rawAttrs' in link && 'href' in link.attrs) {
                        let href = "https://mkwrs.com/mkwii/" + link.attrs.href
                        race_urls.push(href)
                    }
                }
            }
        }
        resolve(race_urls)
    })
}

export async function getRaceURLs(game: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
        if (game === "mkwii") {
            console.log()
            resolve(await getMKWiiUrls())
        }
        let race_urls = []
        let base_url = `https://mkwrs.com/${game}/`
        const html = await fetchHTML(base_url)
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
                        race_urls.push(raceURL)
                    }
                }
            }
        }
        if (!Array.isArray(race_urls)) {
            reject("Not array")
        }
        resolve(removeYouTubeLinksFromArray(removeDuplicatesFromArray(race_urls)))
    })
}
