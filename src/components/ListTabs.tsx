import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import './ListTabs.css';

type Tab = { id: number; title: string };

interface ListTabsProps {
    selectedId: number | null;
    lists: Tab[];
    onSelect: (id: number) => void;
}

const ListTabs: React.FC<ListTabsProps> = ({ selectedId, lists, onSelect }) => {
    return (
        <div className="tabs-wrapper">
            <IonSegment
                value={selectedId ? String(selectedId) : undefined}
                onIonChange={(e) => {
                    const v = (e as any).detail?.value;
                    if (!v) return;
                    const id = Number(v);
                    onSelect(id);
                }}
            >
                {lists.map((l) => (
                    <IonSegmentButton key={l.id} value={String(l.id)}>
                        <IonLabel>{l.title}</IonLabel>
                    </IonSegmentButton>
                ))}
            </IonSegment>
        </div>
    );
};

export default ListTabs;


