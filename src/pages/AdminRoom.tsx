import { useHistory, useParams } from 'react-router-dom';

/* import useAuth from '../hooks/useAuth'; */
import useRoom from '../hooks/useRoom';

import logoImg from '../assets/logo.svg';
import deleteImg from '../assets/delete.svg';
import checkImg from '../assets/check.svg';
import answerImg from '../assets/answer.svg';

import Button from '../components/Button';
import Question from '../components/Question';
import RoomCode from '../components/RoomCode';

import '../styles/room.scss';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
};

export default function AdminRoom() {
  /* const { user } = useAuth(); */

  const history = useHistory();

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/');
  };

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  };

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  };

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo" />
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala: {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {
            questions.map(question => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighLighted}
                >
                  {!question.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighLightQuestion(question.id)}
                      >
                        <img src={answerImg} alt="Dar destaque a pergunta" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Deletar pergunta" />
                  </button>
                </Question>
              )
            })
          }
        </div>
      </main>
    </div>
  );
};