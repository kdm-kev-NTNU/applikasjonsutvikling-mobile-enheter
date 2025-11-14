import { useEffect, useRef, useState } from 'react';
import { IonButton, IonInput, IonItem } from '@ionic/react';
import './AddItemInput.css';


interface AddItemInputProps {
    placeholder?: string;
    initialValue?: string;
    onValueChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    autoFocus?: boolean;
}

// Enkel input-komponent som kapsler IonInput + "Legg til"-knapp.
const AddItemInput: React.FC<AddItemInputProps> = ({ placeholder, initialValue, onValueChange, onSubmit, autoFocus }) => {
    const [text, setText] = useState(initialValue || '');
    const inputRef = useRef<any>(null);
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

    // Trim + valider tom streng
    const handleSubmit = () => {
        const trimmed = (text || '').trim();
        if (!trimmed) return;
        if (onSubmit) {
            onSubmit(trimmed);
        }

        setText('');
        if (onValueChange) {
            onValueChange('');
        }
        setTimeout(() => {
            try {
                inputRef.current?.setFocus?.();
            } catch { }
        }, 80);
    };

    // Enkel auto-focus når parent ber om det (rett etter ny liste)
    useEffect(() => {
        if (!autoFocus) return;
        const t = setTimeout(() => {
            try {
                inputRef.current?.setFocus?.();
            } catch { }
        }, 150);
        return () => clearTimeout(t);
    }, [autoFocus]);

    return (
        // Form gjør at Enter i input kjører onSubmit
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <IonItem className="add-item">
                <IonInput
                    ref={inputRef}
                    value={text}
                    placeholder={placeholder || 'Skriv noe...'}
                    onIonInput={handleChange}
                    type="text"
                    enterkeyhint="done"
                />
                <IonButton type="submit" slot="end">
                    Legg til
                </IonButton>
            </IonItem>
        </form>
    );
};

export default AddItemInput;


