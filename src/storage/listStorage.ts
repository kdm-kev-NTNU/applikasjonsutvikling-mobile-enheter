
export type ListModel = { id: number; title: string; items: TodoItem[] };

export type TodoItem = { id: number; text: string; done: boolean };
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const LISTS_DIR = 'lists';

function listPath(id: number): string {
    return `${LISTS_DIR}/list-${id}.json`;
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
        const raw = (res as any).files as any[] || [];
        const names: string[] = raw.map((f: any) => (typeof f === 'string' ? f : f?.name)).filter(Boolean);

        console.log('[storage] readdir lists:', names);

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
                console.warn('[storage] failed to read/parse file:', name, e);
            }
        }

        lists.sort((a, b) => (a.title.localeCompare(b.title) || a.id - b.id));
        return lists;
    } catch (e) {
        console.warn('[storage] readdir failed, returning empty list', e);
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
        // Logg innholdet i katalogen etter skriving
        try {
            const res = await Filesystem.readdir({ directory: Directory.Data, path: LISTS_DIR });
            const raw = (res as any).files as any[] || [];
            const names: string[] = raw.map((f: any) => (typeof f === 'string' ? f : f?.name)).filter(Boolean);
            console.log('[storage] after save, files:', names);
        } catch { /* noop */ }
    } catch (e) {
        console.warn('[storage] saveList failed', e);
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
        console.warn('[storage] deleteListFile warning', e);
    }
    // Logg innholdet i katalogen etter sletting
    try {
        const res = await Filesystem.readdir({ directory: Directory.Data, path: LISTS_DIR });
        const raw = (res as any).files as any[] || [];
        const names: string[] = raw.map((f: any) => (typeof f === 'string' ? f : f?.name)).filter(Boolean);
        console.log('[storage] after delete, files:', names);
    } catch { }
}