import { IonButton, IonItem, IonList } from '@ionic/react';
import AddItemInput from './AddItemInput';

type TodoItem = { id: number; text: string; done: boolean };
type ListModel = { id: number; title: string; items: TodoItem[] };

interface SelectedListPaneProps {
    list: ListModel;
    itemDraft: string;
    onItemDraftChange: (value: string) => void;
    onAddItem: (text: string) => void;
    onToggleItem: (itemId: number) => void;
    onDeleteList: () => void;
}

const SelectedListPane: React.FC<SelectedListPaneProps> = ({
    list,
    itemDraft,
    onItemDraftChange,
    onAddItem,
    onToggleItem,
    onDeleteList
}) => {
    return (
        <div style={{ paddingTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 12px' }}>
                <IonButton color="danger" fill="outline" size="small" onClick={onDeleteList}>
                    Slett liste
                </IonButton>
            </div>
            <AddItemInput
                placeholder="Legg til vare..."
                initialValue={itemDraft}
                onValueChange={onItemDraftChange}
                onSubmit={onAddItem}
            />
            <div style={{ padding: '0 12px', fontWeight: 600, marginTop: 8 }}>Ukjøpt</div>
            <IonList inset>
                {list.items.filter(it => !it.done).map((it, idx) => (
                    <IonItem
                        key={it.id}
                        button
                        detail={false}
                        onClick={() => onToggleItem(it.id)}
                        tabIndex={0}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 8 }}>
                            <div style={{ fontWeight: 600 }}>{idx + 1}.</div>
                            <div style={{ flex: 1 }}>{it.text}</div>
                        </div>
                    </IonItem>
                ))}
            </IonList>
            <div style={{ padding: '0 12px', fontWeight: 600, marginTop: 8 }}>Kjøpt</div>
            <IonList inset>
                {list.items.filter(it => it.done).map((it, idx) => (
                    <IonItem
                        key={it.id}
                        button
                        detail={false}
                        onClick={() => onToggleItem(it.id)}
                        tabIndex={0}
                        style={{ opacity: 0.8 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 8 }}>
                            <div style={{ fontWeight: 600 }}>{idx + 1}.</div>
                            <div style={{ flex: 1, textDecoration: 'line-through' }}>{it.text}</div>
                        </div>
                    </IonItem>
                ))}
            </IonList>
        </div>
    );
};

export default SelectedListPane;


