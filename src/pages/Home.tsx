import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import ListManager from '../components/ListManager';
import { useState } from 'react';

const Home: React.FC = () => {
  const [title, setTitle] = useState('Blank');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ListManager onSelectedTitleChange={setTitle} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
