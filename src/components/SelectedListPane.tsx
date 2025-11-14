import { IonButton, IonItem, IonList } from '@ionic/react';
import AddItemInput from './AddItemInput';
import './SelectedListPane.css';

type TodoItem = { id: number; text: string; done: boolean };
type ListModel = { id: number; title: string; items: TodoItem[] };

interface SelectedListPaneProps {
    list: ListModel;
    itemDraft: string;
    onItemDraftChange: (value: string) => void;
    onAddItem: (text: string) => void;
    onToggleItem: (itemId: number) => void;
    onDeleteList: () => void;
    // Når true, forsøk å auto-fokusere vare-input (f.eks. rett etter ny liste er opprettet)
    autoFocusItemInput?: boolean;
}

function renderSection(
    title: string,
    items: TodoItem[],
    onToggleItem: (id: number) => void,
    done = false
) {
    return (
        <>
            <div className="section-title">{title}</div>
            <IonList inset>
                {items.map((it, idx) => (
                    <IonItem
                        key={it.id}
                        button
                        detail={false}
                        onClick={() => onToggleItem(it.id)}
                        className={done ? 'item-done' : undefined}
                    >
                        <div className="item-row">
                            <div className="item-index">{idx + 1}.</div>
                            <div className={`item-text${done ? ' item-text--done' : ''}`}>{it.text}</div>
                        </div>
                    </IonItem>
                ))}
            </IonList>
        </>
    );
}

const SelectedListPane: React.FC<SelectedListPaneProps> = ({
    list,
    itemDraft,
    onItemDraftChange,
    onAddItem,
    onToggleItem,
    onDeleteList,
    autoFocusItemInput
}) => {
    return (
        <div className="ion-padding-top">
            <div className="pane-toolbar">
                <IonButton color="danger" fill="outline" size="small" onClick={onDeleteList}>
                    Slett liste
                </IonButton>
            </div>
            <AddItemInput
                placeholder="Legg til vare..."
                initialValue={itemDraft}
                onValueChange={onItemDraftChange}
                onSubmit={onAddItem}
                autoFocus={!!autoFocusItemInput}
            />
            {renderSection('Ukjøpt', list.items.filter(it => !it.done), onToggleItem, false)}
            {renderSection('Kjøpt', list.items.filter(it => it.done), onToggleItem, true)}
        </div>
    );
};

export default SelectedListPane;