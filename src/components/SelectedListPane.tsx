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
        <div className="selected-pane">
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
            <div className="section-title">Ukjøpt</div>
            <IonList inset>
                {list.items.filter(it => !it.done).map((it, idx) => (
                    <IonItem
                        key={it.id}
                        button
                        detail={false}
                        onClick={() => onToggleItem(it.id)}
                        tabIndex={0}
                    >
                        <div className="item-row">
                            <div className="item-index">{idx + 1}.</div>
                            <div className="item-text">{it.text}</div>
                        </div>
                    </IonItem>
                ))}
            </IonList>
            <div className="section-title">Kjøpt</div>
            <IonList inset>
                {list.items.filter(it => it.done).map((it, idx) => (
                    <IonItem
                        key={it.id}
                        button
                        detail={false}
                        onClick={() => onToggleItem(it.id)}
                        tabIndex={0}
                        className="item-done"
                    >
                        <div className="item-row">
                            <div className="item-index">{idx + 1}.</div>
                            <div className="item-text item-text--done">{it.text}</div>
                        </div>
                    </IonItem>
                ))}
            </IonList>
        </div>
    );
};

export default SelectedListPane;


