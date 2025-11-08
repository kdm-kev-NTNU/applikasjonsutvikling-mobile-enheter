import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';

type Tab = { id: number; title: string };

interface ListTabsProps {
    selectedId: number | null;
    lists: Tab[];
    onSelect: (id: number) => void;
}

const ListTabs: React.FC<ListTabsProps> = ({ selectedId, lists, onSelect }) => {
    return (
        <div style={{ padding: '0 12px', marginTop: 4 }}>
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
                    <IonSegmentButton key={l.id} value={String(l.id)} tabIndex={0}>
                        <IonLabel>{l.title}</IonLabel>
                    </IonSegmentButton>
                ))}
            </IonSegment>
        </div>
    );
};

export default ListTabs;


