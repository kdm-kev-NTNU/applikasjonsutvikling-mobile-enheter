
export type ListModel = { id: number; title: string; items: TodoItem[] };

export type TodoItem = { id: number; text: string; done: boolean };
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const LISTS_DIR = 'lists';
const VERBOSE_LOG_DIR = false; // sett til true for mer katalog-logging

function listPath(id: number): string {
    return `${LISTS_DIR}/list-${id}.json`;
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
        await Filesystem.writeFile({
            directory: Directory.Data,
            path: listPath(list.id),
            data: JSON.stringify(list),
            encoding: 'utf8' as Encoding
        });
        console.log(`[storage] lagret liste #${list.id} -> ${listPath(list.id)}`);
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
        await Filesystem.deleteFile({
            directory: Directory.Data,
            path: listPath(listId)
        });
    } catch (e) {
        // Fil finnes kanskje ikke; logg og fortsett
        console.warn('[storage] deleteListFile advarsel', e);
    }
    console.log(`[storage] slettet fil for liste #${listId} -> ${listPath(listId)}`);
    if (VERBOSE_LOG_DIR) {
        await logListsDir('etter sletting');
    }
}