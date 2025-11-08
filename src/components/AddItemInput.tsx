import { useEffect, useRef, useState } from 'react';
import { IonButton, IonInput, IonItem } from '@ionic/react';

interface AddItemInputProps {
    placeholder?: string;
    initialValue?: string;
    onValueChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    // Når true: forsøk å fokusere input ved mount/oppdatering for å åpne tastatur (spesielt Android)
    autoFocus?: boolean;
}

const AddItemInput: React.FC<AddItemInputProps> = ({ placeholder, initialValue, onValueChange, onSubmit, autoFocus }) => {
    const [text, setText] = useState(initialValue || '');
    // Holder en ref til IonInput slik at vi kan fokusere feltet etter submit
    const inputRef = useRef<any>(null);
    // Ref til "Legg til"-knappen og en enkel guard mot dobbel-submit
    const buttonRef = useRef<any>(null);
    const submittingRef = useRef(false);

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

    // Fokuserer og trykker "Legg til"-knappen (for Enter-støtte på web/Android)
    const clickAddButton = () => {
        const trimmed = (text || '').trim();
        if (!trimmed) return;
        if (submittingRef.current) return;
        submittingRef.current = true;
        try {
            buttonRef.current?.setFocus?.();
        } catch { }
        setTimeout(() => {
            try {
                buttonRef.current?.click?.();
            } catch { }
            setTimeout(() => {
                submittingRef.current = false;
            }, 150);
        }, 0);
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
            } catch { }
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
                            clickAddButton();
                        }
                    };
                    el.addEventListener('keydown', onKeyDown);
                    cleanup = () => el.removeEventListener('keydown', onKeyDown);
                }
            } catch { }
        })();

        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    // Enkel auto-focus når flagget er satt (f.eks. rett etter ny liste er opprettet)
    useEffect(() => {
        if (!autoFocus) return;
        const t = setTimeout(() => {
            try {
                // Litt lenger delay enn refokus etter submit, så dette vinner fokus
                inputRef.current?.setFocus?.();
            } catch { }
        }, 150);
        return () => clearTimeout(t);
    }, [autoFocus]);

    return (
        <form onSubmit={(e) => { e.preventDefault(); clickAddButton(); }}>
            <IonItem style={{ margin: 12 }}>
                <IonInput
                    ref={inputRef}
                    value={text}
                    placeholder={placeholder || 'Skriv noe...'}
                    // Viktig: onIonInput oppdaterer på hver tast (onIonChange kan fyre først ved blur)
                    onIonInput={handleChange}
                    // Legger også på keydown her i tillegg til native-lytter, bare for å være helt sikker
                    onKeyDown={(e: any) => {
                        if (e?.key === 'Enter') {
                            e.preventDefault();
                            clickAddButton();
                        }
                    }}
                    type="text"
                    enterkeyhint="done"
                />
                <IonButton ref={buttonRef} slot="end" onClick={handleSubmit}>
                    Legg til
                </IonButton>
            </IonItem>
        </form>
    );
};

export default AddItemInput;


