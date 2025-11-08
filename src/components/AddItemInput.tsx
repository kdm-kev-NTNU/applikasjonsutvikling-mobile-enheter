import { useEffect, useState } from 'react';
import { IonButton, IonInput, IonItem } from '@ionic/react';

interface AddItemInputProps {
    placeholder?: string;
    initialValue?: string;
    onValueChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
}

const AddItemInput: React.FC<AddItemInputProps> = ({ placeholder, initialValue, onValueChange, onSubmit }) => {
    const [text, setText] = useState(initialValue || '');

    useEffect(() => {
        if (initialValue !== undefined) {
            setText(initialValue);
        }
    }, [initialValue]);

    const handleChange = (e: CustomEvent) => {
        const v = (e as any).detail?.value ?? '';
        setText(v);
        if (onValueChange) {
            onValueChange(v);
        }
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(text);
        }
    };

    return (
        <IonItem style={{ margin: 12 }}>
            <IonInput
                value={text}
                placeholder={placeholder || 'Skriv noe...'}
                onIonChange={handleChange}
                type="text"
            />
            <IonButton slot="end" onClick={handleSubmit} disabled={!text}>
                Legg til
            </IonButton>
        </IonItem>
    );
};

export default AddItemInput;


