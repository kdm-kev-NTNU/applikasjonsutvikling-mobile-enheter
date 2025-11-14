import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';

type Tab = { id: number; title: string };

interface ListTabsProps {
    selectedId: number | null;
    lists: Tab[];
    onSelect: (id: number) => void;
}

const ListTabs: React.FC<ListTabsProps> = ({ selectedId, lists, onSelect }) => {
    return (
        <IonSegment
            className="ion-padding-horizontal ion-margin-top"
            value={selectedId ? String(selectedId) : undefined}
            onIonChange={(e) => {
                const v = (e as any).detail?.value;
                if (!v) return;
                const id = Number(v);
                onSelect(id);
            }}
            scrollable
        >
            {lists.map((l) => (
                <IonSegmentButton key={l.id} value={String(l.id)}>
                    <IonLabel>{l.title}</IonLabel>
                </IonSegmentButton>
            ))}
        </IonSegment>
    );
};

export default ListTabs;