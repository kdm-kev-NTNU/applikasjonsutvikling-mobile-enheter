import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ListManager from '../components/ListManager';
import { useState } from 'react';

// Home komponent
const Home: React.FC = () => {
  const [title, setTitle] = useState('Blank');
  // Returnerer Home-siden
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Handlekurva</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="page-flex">
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{title}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div className="page-content">
            <ListManager onSelectedTitleChange={setTitle} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
