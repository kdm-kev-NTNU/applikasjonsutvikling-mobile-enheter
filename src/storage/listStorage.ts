import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

export type TodoItem = { id: number; text: string; done: boolean };
export type ListModel = { id: number; title: string; items: TodoItem[] };

const LISTS_DIR = 'handlelister';

async function ensureBaseDir(): Promise<void> {
    try {
        await Filesystem.mkdir({
            path: LISTS_DIR,
            directory: Directory.Data,
            recursive: true
        });
    } catch (err: any) {
        // Ignorer om den allerede eksisterer
        if (!err || (typeof err.message === 'string' && !err.message.includes('exists'))) {
            
        }
    }
}

function getFileNameForList(id: number): string {
    return `${LISTS_DIR}/list-${id}.json`;
}

export async function readAllLists(): Promise<ListModel[]> {
    await ensureBaseDir();
    try {
        const dir = await Filesystem.readdir({
            path: LISTS_DIR,
            directory: Directory.Data
        });
        const entries = (dir.files ?? []) as Array<string | { name: string }>;
        const jsonFiles = entries
            .map((f: string | { name: string }) => (typeof f === 'string' ? f : f.name))
            .filter((name: string) => name && name.endsWith('.json'));

        const results: ListModel[] = [];
        for (const name of jsonFiles) {
            try {
                const file = await Filesystem.readFile({
                    path: `${LISTS_DIR}/${name}`,
                    directory: Directory.Data,
                    encoding: Encoding.UTF8
                });
                const parsed = JSON.parse(file.data as string);
                if (parsed && typeof parsed.id === 'number' && typeof parsed.title === 'string' && Array.isArray(parsed.items)) {
                    results.push(parsed as ListModel);
                }
            } catch {
                // skip filen om den ikke kan leses
            }
        }
        // sorter listene etter tittel og id
        results.sort((a, b) => (a.title.localeCompare(b.title) || a.id - b.id));
        return results;
    } catch {
        return [];
    }
}

export async function saveList(list: ListModel): Promise<void> {
    await ensureBaseDir();
    try {
        await Filesystem.writeFile({
            path: getFileNameForList(list.id),
            directory: Directory.Data,
            data: JSON.stringify(list),
            encoding: Encoding.UTF8
        });
    } catch {
        // ignorer feil hvis filen ikke kan lagres
    }
}

export async function deleteListFile(listId: number): Promise<void> {
    try {
        await Filesystem.deleteFile({
            path: getFileNameForList(listId),
            directory: Directory.Data
        });
    } catch {
        // ingonerer fil hvis den ikke finnes
    }
}


