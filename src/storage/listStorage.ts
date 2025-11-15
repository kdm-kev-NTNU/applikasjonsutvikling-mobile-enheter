
export type ListModel = { id: number; title: string; items: TodoItem[] };

export type TodoItem = { id: number; text: string; done: boolean };
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const LISTS_DIR = 'lists';
const VERBOSE_LOG_DIR = false; // sett til true for mer katalog-logging

// Brukes for å generere et filnavn basert på tittel - for tydlig logging liste endringer
function slugifyTitle(input: string): string {
    const lower = String(input || '').toLowerCase().trim();
    let slug = lower
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '') // fjern diakritiske tegn
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // ulovlige tegn i filnavn (Windows)
        .replace(/\s+/g, '-') // mellomrom til bindestrek
        .replace(/-+/g, '-') // slå sammen flere bindestreker
        .replace(/^\.+/, '') // ikke start med punktum
        .replace(/^-+|-+$/g, ''); // trim bindestreker i kantene

    if (!slug) slug = 'liste';
    if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/.test(slug)) {
        slug = `${slug}-fil`;
    }
    if (slug.length > 64) {
        slug = slug.slice(0, 64).replace(/-+$/g, '');
    }
    return slug;
}

// Genererer ny filnavn basert på tittel og id
function newFileName(title: string, id: number): string {
    const slug = slugifyTitle(title);
    return `${slug}-${id}.json`;
}

// Genererer ny filsti basert på tittel og id
function newFilePath(title: string, id: number): string {
    return `${LISTS_DIR}/${newFileName(title, id)}`;
}

// Finn eksisterende fil for id
async function findExistingFileForId(id: number): Promise<string | null> {
    try {
        const res = await Filesystem.readdir({
            directory: Directory.Data,
            path: LISTS_DIR
        });
        const names = fileNamesFromReaddir(res);
        const idSuffix = `-${id}.json`;
        for (const name of names) {
            if (!String(name).endsWith('.json')) continue;
            if (name.endsWith(idSuffix)) {
                return `${LISTS_DIR}/${name}`;
            }
        }
        return null;
    } catch {
        return null;
    }
}

// Leser en liste basert på id
async function readListById(id: number): Promise<ListModel | null> {
    try {
        const path = await findExistingFileForId(id);
        if (!path) return null;
        const file = await Filesystem.readFile({
            directory: Directory.Data,
            path,
            encoding: 'utf8' as Encoding
        });
        const data = typeof file.data === 'string' ? file.data : '';
        const parsed = JSON.parse(data) as ListModel;
        if (parsed && typeof parsed.id === 'number' && Array.isArray(parsed.items)) {
            return parsed;
        }
        return null;
    } catch {
        return null;
    }
}

function fileNamesFromReaddir(res: any): string[] {
    const raw = (res as any).files as any[] || [];
    return raw.map((f: any) => (typeof f === 'string' ? f : f?.name)).filter(Boolean);
}

async function logListsDir(context: string): Promise<void> {
    try {
        const res = await Filesystem.readdir({ directory: Directory.Data, path: LISTS_DIR });
        const names = fileNamesFromReaddir(res);
        console.log(`[storage] ${context}: ${names.length} fil(er) i '${LISTS_DIR}'`, names);
    } catch (e) {
        console.warn('[storage] kunne ikke liste katalog:', e);
    }
}

async function ensureListsDir(): Promise<void> {
    try {
        await Filesystem.mkdir({
            directory: Directory.Data,
            path: LISTS_DIR,
            recursive: true
        });
    } catch {
        // Ignorer om katalogen allerede finnes
    }
}

export async function readAllLists(): Promise<ListModel[]> {
    await ensureListsDir();

    try {
        const res = await Filesystem.readdir({
            directory: Directory.Data,
            path: LISTS_DIR
        });
        const names = fileNamesFromReaddir(res);
        console.log(`[storage] oppstart: ${names.length} fil(er) i '${LISTS_DIR}'`, names);

        const lists: ListModel[] = [];
        for (const name of names) {
            if (!String(name).endsWith('.json')) continue;
            try {
                const file = await Filesystem.readFile({
                    directory: Directory.Data,
                    path: `${LISTS_DIR}/${name}`,
                    encoding: 'utf8' as Encoding
                });
                const data = typeof file.data === 'string' ? file.data : '';
                const parsed = JSON.parse(data) as ListModel;
                // Enkel validering
                if (parsed && typeof parsed.id === 'number' && Array.isArray(parsed.items)) {
                    lists.push(parsed);
                }
            } catch (e) {
                console.warn('[storage] klarte ikke å lese/tolke filen', name, e);
            }
        }

        lists.sort((a, b) => (a.title.localeCompare(b.title) || a.id - b.id));
        return lists;
    } catch (e) {
        console.warn('[storage] lesing av katalog feilet, returnerer tom liste', e);
        return [];
    }
}

export async function saveList(list: ListModel): Promise<void> {
    await ensureListsDir();
    try {
        const targetPath = newFilePath(list.title, list.id);
        const existing = await readListById(list.id);
        // Finn og fjern eksisterende fil for samme id dersom navnet blir annerledes
        const existingPath = await findExistingFileForId(list.id);
        if (existingPath && existingPath !== targetPath) {
            try {
                await Filesystem.deleteFile({
                    directory: Directory.Data,
                    path: existingPath
                });
            } catch {
                // ignorer feil ved sletting av gammel fil
            }
        }
        await Filesystem.writeFile({
            directory: Directory.Data,
            path: targetPath,
            data: JSON.stringify(list),
            encoding: 'utf8' as Encoding
        });
        console.log(`[storage] lagret liste #${list.id} -> ${targetPath}`);
        if (!existing) {
            console.log(`[storage] opprettet liste '${list.title}' (#${list.id})`);
        } else {
            const previousCount = Array.isArray(existing.items) ? existing.items.length : 0;
            const newCount = Array.isArray(list.items) ? list.items.length : 0;
            if (newCount > previousCount) {
                const prevIds = new Set<number>((existing.items || []).map(i => i.id));
                const addedItems = (list.items || []).filter(i => !prevIds.has(i.id));
                if (addedItems.length > 0) {
                    for (const item of addedItems) {
                        const name = typeof item?.text === 'string' ? item.text : '';
                        console.log(`[storage] la til item '${name}' i liste '${list.title}' (#${list.id})`);
                    }
                } else {
                    console.log(`[storage] la til item i liste '${list.title}' (#${list.id})`);
                }
            }
        }
        if (VERBOSE_LOG_DIR) {
            await logListsDir('etter lagring');
        }
    } catch (e) {
        console.warn('[storage] saveList feilet', e);
        throw e;
    }
}

export async function deleteListFile(listId: number): Promise<void> {
    await ensureListsDir();
    try {
        const existing = await readListById(listId);
        const existingPath = await findExistingFileForId(listId);
        if (existingPath) {
            await Filesystem.deleteFile({
                directory: Directory.Data,
                path: existingPath
            });
        }
        if (existing) {
            console.log(`[storage] slettet liste '${existing.title}' (#${listId})`);
        } else {
            console.log(`[storage] slettet liste #${listId}`);
        }
    } catch (e) {
        // Fil finnes kanskje ikke; logg og fortsett
        console.warn('[storage] deleteListFile advarsel', e);
    }
    if (VERBOSE_LOG_DIR) {
        await logListsDir('etter sletting');
    }
}