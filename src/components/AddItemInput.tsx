import { useEffect, useRef, useState } from 'react';
import { IonButton, IonInput, IonItem } from '@ionic/react';

interface AddItemInputProps {
    placeholder?: string;
    initialValue?: string;
    onValueChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
}

const AddItemInput: React.FC<AddItemInputProps> = ({ placeholder, initialValue, onValueChange, onSubmit }) => {
    const [text, setText] = useState(initialValue || '');
    // Holder en ref til IonInput slik at vi kan fokusere feltet etter submit
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

    const handleSubmit = () => {
        // Trim for å unngå å legge inn tomme elementer
        const trimmed = (text || '').trim();
        if (!trimmed) return;
        if (onSubmit) {
            onSubmit(trimmed);
        }
        // Tøm lokalt og løft opp tom verdi til parent
        setText('');
        if (onValueChange) {
            onValueChange('');
        }
        // Behold fokus etter submit for videre skriving
        setTimeout(() => {
            try {
                inputRef.current?.setFocus?.();
            } catch {}
        }, 80);
    };

    // Lytter på "Enter" på  input-elementet
    useEffect(() => {
        let cleanup: (() => void) | undefined;

        (async () => {
            try {
                const el = await inputRef.current?.getInputElement?.();
                if (el) {
                    const onKeyDown = (e: KeyboardEvent) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSubmit();
                        }
                    };
                    el.addEventListener('keydown', onKeyDown);
                    cleanup = () => el.removeEventListener('keydown', onKeyDown);
                }
            } catch {}
        })();

        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    return (
        <IonItem style={{ margin: 12 }}>
            <IonInput
                ref={inputRef}
                value={text}
                placeholder={placeholder || 'Skriv noe...'}
                onIonChange={handleChange}
                type="text"
                enterkeyhint="done"
            />
            <IonButton slot="end" onClick={handleSubmit} disabled={!text}>
                Legg til
            </IonButton>
        </IonItem>
    );
};

export default AddItemInput;


