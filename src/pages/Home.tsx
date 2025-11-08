import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useState } from 'react';
import AddItemInput from '../components/AddItemInput';

const Home: React.FC = () => {
  const [draft, setDraft] = useState('');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AddItemInput placeholder="Skriv element..." onValueChange={setDraft} />
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
