import { useEffect, useState } from 'react';
import AddItemInput from './AddItemInput';
import ListTabs from './ListTabs';
import SelectedListPane from './SelectedListPane';

type TodoItem = { id: number; text: string; done: boolean };
type ListModel = { id: number; title: string; items: TodoItem[] };

interface ListManagerProps {
    onSelectedTitleChange?: (title: string) => void;
}

// Administrerer lister og valgt liste; kobler sammen tabs, input og innhold.
const ListManager: React.FC<ListManagerProps> = ({ onSelectedTitleChange }) => {
    const [lists, setLists] = useState<ListModel[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [itemDrafts, setItemDrafts] = useState<{ [listId: number]: string }>({});
    const [listDraft, setListDraft] = useState('');
    // Brukes én gang etter ny liste for å fokusere vare-input (holder tastatur åpent).
    const [focusItemInputOnce, setFocusItemInputOnce] = useState(false);

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
        setLists(prev => prev.map(l => {
            if (l.id !== listId) return l;
            const ni: TodoItem = { id: Date.now(), text: t, done: false };
            return { ...l, items: [...l.items, ni] };
        }));
        setItemDrafts(prev => ({ ...prev, [listId]: '' }));
    };

    const toggleItem = (listId: number, itemId: number) => {
        // Togglar done-flagget uten å mutere eksisterende state.
        setLists(prev => prev.map(l => {
            if (l.id !== listId) return l;
            return {
                ...l,
                items: l.items.map(it => it.id === itemId ? { ...it, done: !it.done } : it)
            };
        }));
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


