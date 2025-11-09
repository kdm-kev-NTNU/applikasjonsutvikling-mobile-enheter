
export type TodoItem = { id: number; text: string; done: boolean };
export type ListModel = { id: number; title: string; items: TodoItem[] };

// Midlertidig in-memory lagring (ingen fil-lagring)
let memoryLists: ListModel[] = [];

export async function readAllLists(): Promise<ListModel[]> {
    const copy = [...memoryLists];
    copy.sort((a, b) => (a.title.localeCompare(b.title) || a.id - b.id));
    return copy;
}

export async function saveList(list: ListModel): Promise<void> {
    const idx = memoryLists.findIndex(l => l.id === list.id);
    if (idx >= 0) {
        memoryLists[idx] = list;
    } else {
        memoryLists.push(list);
    }
}

export async function deleteListFile(listId: number): Promise<void> {
    memoryLists = memoryLists.filter(l => l.id !== listId);
}