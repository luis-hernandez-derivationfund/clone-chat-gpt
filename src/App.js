import { useState, useEffect } from 'react';
import { FaImage } from 'react-icons/fa';

const App = () => {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState([]);
  const [image, setImage] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue('');
    setCurrentTitle(null);
  };

  const handleClick = (uniquetitle) => {
    setCurrentTitle(uniquetitle);
    setMessage(null);
    setValue('');
  };

  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await fetch(
        'http://localhost:8000/api/completions',
        options,
      );

      // Verifica el estado de la respuesta
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Verifica que el cuerpo no esté vacío
      const data = await response.json();
      if (!data || !data.choices || data.choices.length === 0) {
        throw new Error('Invalid response data');
      }

      console.log(data);
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const getImage = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response_image = await fetch(
        'http://localhost:8000/images/generations',
        options,
      );

      // Verifica el estado de la respuesta
      if (!response_image.ok) {
        throw new Error(`HTTP error! Status: ${response_image.status}`);
      }

      const responseData = await response_image.json();
      if (
        !responseData ||
        !responseData.data ||
        responseData.data.length === 0 ||
        !responseData.data[0].url
      ) {
        throw new Error('Invalid response data');
      }

      const imageUrl = responseData.data[0].url;
      setImage(imageUrl);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    // para evaluar el titulo actual
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: 'user',
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle, value]);

  const currentChat = previousChats.filter(
    (previousChats) => previousChats.title === currentTitle,
  );
  const uniquetitles = Array.from(
    new Set(previousChats.map((previousChats) => previousChats.title)),
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniquetitles?.map((uniquetitle, index) => (
            <li key={index} onClick={() => handleClick(uniquetitle)}>
              {uniquetitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Luis v.2.0 esto es development</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>chatgpt</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
              {image && (
                <li>
                  <img
                    src={image}
                    alt="imagen"
                    style={{ width: '300px', height: 'auto' }}
                  />
                </li>
              )}
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
            <FaImage
              onClick={getImage}
              size={30}
              color="blue"
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            />
          </div>
          <p className="info">
            Chat GPT Mar 14 version. Free Research Preview. Our goal is to make
            AI systems more natural and safe to interact with. Your feedback
            will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
