import { useEffect, useState } from 'react';
import AddItemInput from './AddItemInput';
import ListTabs from './ListTabs';
import SelectedListPane from './SelectedListPane';
import { deleteListFile, readAllLists, saveList, type ListModel, type TodoItem } from '../storage/listStorage';


interface ListManagerProps {
    onSelectedTitleChange?: (title: string) => void;
}

// Administrerer lister og valgt liste; kobler sammen tabs, input og innhold.
const ListManager: React.FC<ListManagerProps> = ({ onSelectedTitleChange }) => {
    const [lists, setLists] = useState<ListModel[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [itemDrafts, setItemDrafts] = useState<{ [listId: number]: string }>({});
    const [listDraft, setListDraft] = useState('');
    const [focusItemInputOnce, setFocusItemInputOnce] = useState(false);

    // Last inn eksisterende lister ved oppstart
    useEffect(() => {
        (async () => {
            const loaded = await readAllLists();
            setLists(loaded);
            if (loaded.length > 0) {
                setSelectedListId(loaded[0].id);
            }
        })();
    }, []);

    const handleAddListByText = (text: string) => {
        const t = (text || '').trim();
        if (!t) return;
        const next: ListModel = { id: Date.now(), title: t, items: [] };
        setLists(prev => [...prev, next]);
        setSelectedListId(next.id);
        setListDraft('');
        // Be om fokus på vare-input når panelet vises, og slå det raskt av igjen.
        setFocusItemInputOnce(true);
        setTimeout(() => setFocusItemInputOnce(false), 500);
        // lagre ny liste til fil
        void saveList(next);
    };

    const handleDeleteList = (id: number) => {
        setLists(prev => prev.filter(x => x.id !== id));
        setItemDrafts(prev => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
        if (selectedListId === id) {
            setSelectedListId(null);
        }
        // Slett fil fra disk
        void deleteListFile(id);
    };

    useEffect(() => {
        // Gi parent beskjed om tittelen på valgt liste (for f.eks. header).
        const selected = lists.find(l => l.id === selectedListId) || null;
        if (onSelectedTitleChange) {
            onSelectedTitleChange(selected ? selected.title : 'Blank');
        }
    }, [lists, selectedListId, onSelectedTitleChange]);

    const handleAddItem = (listId: number, text: string) => {
        const t = (text || '').trim();
        if (!t) return;
        // Beregn oppdatert liste og persistér til fil
        const current = lists.find(l => l.id === listId);
        if (!current) return;
        const ni: TodoItem = { id: Date.now(), text: t, done: false };
        const updated: ListModel = { ...current, items: [...current.items, ni] };
        setLists(prev => prev.map(l => (l.id === listId ? updated : l)));
        setItemDrafts(prev => ({ ...prev, [listId]: '' }));
        void saveList(updated);
    };

    const toggleItem = (listId: number, itemId: number) => {
        // Toggle done-flagget uten å endre eksisterende state.
        const current = lists.find(l => l.id === listId);
        if (!current) return;
        const updated: ListModel = {
            ...current,
            items: current.items.map(it => it.id === itemId ? { ...it, done: !it.done } : it)
        };
        setLists(prev => prev.map(l => (l.id === listId ? updated : l)));
        void saveList(updated);
    };

    const selected = lists.find(l => l.id === selectedListId) || null;
    const draftForSelected = selected ? (itemDrafts[selected.id] || '') : '';

    return (
        <>
            {/* Input for å opprette ny liste */}
            <AddItemInput
                placeholder="Ny liste..."
                initialValue={listDraft}
                onValueChange={setListDraft}
                onSubmit={handleAddListByText}
            />
            {/* Tabs for å velge aktiv liste */}
            <ListTabs
                selectedId={selectedListId}
                lists={lists.map(l => ({ id: l.id, title: l.title }))}
                onSelect={setSelectedListId}
            />
            {selected && (
                // Innholdet for valgt liste; håndterer vare-input og toggling.
                <SelectedListPane
                    list={selected}
                    itemDraft={draftForSelected}
                    onItemDraftChange={(v) => setItemDrafts(prev => ({ ...prev, [selected.id]: v }))}
                    onAddItem={(v) => handleAddItem(selected.id, v)}
                    onToggleItem={(itemId) => toggleItem(selected.id, itemId)}
                    onDeleteList={() => handleDeleteList(selected.id)}
                    autoFocusItemInput={focusItemInputOnce}

                />
            )}
        </>
    );
};

export default ListManager;


