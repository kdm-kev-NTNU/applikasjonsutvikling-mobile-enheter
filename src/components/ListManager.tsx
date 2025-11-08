import { useEffect, useState } from 'react';
import AddItemInput from './AddItemInput';
import ListTabs from './ListTabs';
import SelectedListPane from './SelectedListPane';

type TodoItem = { id: number; text: string; done: boolean };
type ListModel = { id: number; title: string; items: TodoItem[] };

interface ListManagerProps {
    onSelectedTitleChange?: (title: string) => void;
}

const ListManager: React.FC<ListManagerProps> = ({ onSelectedTitleChange }) => {
    const [lists, setLists] = useState<ListModel[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [itemDrafts, setItemDrafts] = useState<{ [listId: number]: string }>({});
    const [listDraft, setListDraft] = useState('');

    const handleAddListByText = (text: string) => {
        const t = (text || '').trim();
        if (!t) return;
        const next: ListModel = { id: Date.now(), title: t, items: [] };
        setLists(prev => [...prev, next]);
        setSelectedListId(next.id);
        setListDraft('');
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
            <AddItemInput
                placeholder="Ny liste..."
                initialValue={listDraft}
                onValueChange={setListDraft}
                onSubmit={handleAddListByText}
            />
            <ListTabs
                selectedId={selectedListId}
                lists={lists.map(l => ({ id: l.id, title: l.title }))}
                onSelect={setSelectedListId}
            />
            {selected && (
                <SelectedListPane
                    list={selected}
                    itemDraft={draftForSelected}
                    onItemDraftChange={(v) => setItemDrafts(prev => ({ ...prev, [selected.id]: v }))}
                    onAddItem={(v) => handleAddItem(selected.id, v)}
                    onToggleItem={(itemId) => toggleItem(selected.id, itemId)}
                    onDeleteList={() => handleDeleteList(selected.id)}
                />
            )}
        </>
    );
};

export default ListManager;


