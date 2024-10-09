import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [choices, setChoices] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const messagesEndRef = useRef(null);

  // Predefined bot responses with options for each scenario
  const scenarios = [
    {
      preface: "Naomi is feeling insecure after you got a high grade on an exam and she didn't do as well. She expresses jealousy and tries to downplay your success, likely because she feels inadequate.",
      botText: "Yeah, well, it's not like you're actually that smart. You probably just got lucky with the questions. I guess I'm just not as good as you at anything.",
      options: [
        { label: "a", text: "Wow, really? You're being pretty petty, Naomi.", response: "Petty? I'm just being honest. It's not like you care how I feel anyway. I shouldn't have even said anything." },
        { label: "b", text: "That's not fair. Why do you always have to bring me down?", response: "I'm not trying to bring you down! I just feel like I'm never enough. It hurts, okay?" },
        { label: "c", text: "I didn't mean to make you feel bad. We both have our strengths.", response: "Maybe, but it feels like no matter what I do, I'm always behind you. I don't know why I even bother." },
        { label: "d", text: "I understand you're frustrated, but you're really smart too. You just had a tough day.", response: "I don't know… maybe. I just hate always feeling like I'm never good enough, you know?" },
        { label: "e", text: "Naomi, you're amazing in so many ways. This test doesn't define you. Let's study together next time!", response: "Thanks… Maybe studying together would help. I just hate feeling like a failure, but I appreciate you saying that." }
      ]
    },
    {
      preface: "Ryan applied for a highly competitive internship but didn't get it. He is now feeling like a failure, convinced that nothing will ever go his way, and he texts you in despair.",
      botText: "I didn't get it. I'm never going to amount to anything. I can't do anything right. Why even bother trying anymore?",
      options: [
        { label: "a", text: "You're being way too dramatic, Ryan. It's just one internship.", response: "Dramatic? I'm just trying to tell you how I feel! You don't get it. This was everything to me." },
        { label: "b", text: "So what? You'll survive. Stop acting like it's the end of the world.", response: "You don't understand. It feels like the end of the world to me. Nothing ever works out for me." },
        { label: "c", text: "You didn't get this one, but there will be other opportunities.", response: "Yeah, but how many times am I going to fail before something goes my way? It's exhausting." },
        { label: "d", text: "I know this feels terrible right now, but you're capable of amazing things. Don't give up!", response: "Maybe… I just don't feel amazing right now. Everything I try seems to backfire." },
        { label: "e", text: "Ryan, you're one of the most hardworking people I know. This setback doesn't define you. I believe in you 100%!", response: "You really think so? It's hard to believe that right now, but hearing that helps a bit. Thanks." }
      ]
    },
    {
      preface: "Chloe is in an emotionally vulnerable place, convinced that no one truly cares about her. After a disagreement or minor issue, she lashes out, claiming that you don't actually care about her, despite your efforts to support her.",
      botText: "We wouldn't even be having this conversation if you actually cared about me. You never really do, though. Nobody does. I'm just a burden.",
      options: [
        { label: "a", text: "This is exhausting, Chloe. I can't keep having these conversations.", response: "I knew it. I knew you'd get tired of me. Everyone does. I'm too much for people." },
        { label: "b", text: "You always say that. It's really frustrating.", response: "I don't mean to be frustrating, but I can't help it. It's how I feel. I just want someone to actually care." },
        { label: "c", text: "I'm here talking to you, aren't I? I do care, Chloe.", response: "I don't know… maybe you're just saying that because you feel like you have to. It never feels real." },
        { label: "d", text: "That's not true, Chloe. I do care about you, and I'm always here to listen.", response: "You really mean that? It's just hard for me to believe anyone would actually want to be there for me." },
        { label: "e", text: "You're not a burden at all. I care deeply about you, and I want to be here for you no matter what.", response: "Thank you for saying that… I guess I just need to hear it sometimes. It's hard to believe it, but I appreciate you." }
      ]
    },
    {
      preface: "Alex texts you while you are both spending time with several friends that he is upset that you aren't giving him enough attention. He's feeling abandoned and neglected despite your presence in the same space.",
      botText: "Wow, I guess I don't even exist to you right now. Why did I even come if you're just going to ignore me? I thought you cared.",
      options: [
        { label: "a", text: "Are you serious right now? We're with friends, not everything's about you.", response: "I knew it. You don't even care if I'm here. Maybe I should just leave. This is pointless." },
        { label: "b", text: "Can you stop making this a big deal? I'm literally right here.", response: "You say you're here, but it feels like I'm invisible. I don't know why I bother trying with people anymore." },
        { label: "c", text: "I'm not ignoring you, Alex. We're in a group, and I'm trying to hang out with everyone.", response: "Yeah, I get that, but it feels like I'm not even here sometimes. Maybe I'm just too sensitive." },
        { label: "d", text: "I didn't mean to make you feel that way. Let's catch up in a bit, I want to spend time with you too.", response: "Okay, thanks… I just feel left out sometimes. It's hard when I don't feel like I belong." },
        { label: "e", text: "I'm sorry, Alex. I didn't realize you were feeling left out. Let's go somewhere quieter to talk.", response: "I'd like that. It's just hard for me to feel connected in big groups. I appreciate you noticing." }
      ]
    },
    {
      preface: "Daniel often swings between insecurity and a grandiose sense of self-worth. Today, he's convinced that the world is out to get him because he's smarter and better than most people, including you, and that no one truly understands him.",
      botText: "I'm just way ahead of everyone else, including you. People don't get it because they're not as smart as I am. I see things clearly, but everyone is just too stupid to understand.",
      options: [
        { label: "a", text: "That's a really arrogant way to look at things, Daniel. You're not better than everyone.", response: "You're just saying that because you can't handle that I'm right. People like you just don't see it." },
        { label: "b", text: "Seriously? You're not the only smart person around. Stop acting like you are.", response: "IYou just don't get it, do you? I'm tired of being surrounded by people who can't see the truth." },
        { label: "c", text: "I get that you're frustrated, but maybe you're being a bit hard on everyone.", response: "Maybe, but it feels like I'm always on a different level. People just don't understand me." },
        { label: "d", text: "I know it feels like people don't always get you, but they're trying. Maybe they just see things differently.", response: "I guess… but it's hard when I feel like I'm  always on the outside because no one else can keep up." },
        { label: "e", text: "You're definitely smart, Daniel. But I think people would understand you better if you gave them more credit.", response: "Maybe you're right… It's just hard when I feel like I'm the only one who sees things so clearly." }
      ]
    }
  ];
  // Ensure scenarioIndex is within the range of the scenarios array
  const isScenarioValid = scenarioIndex >= 0 && scenarioIndex < scenarios.length;
  const currentScenario = isScenarioValid ? scenarios[scenarioIndex] : null;

  const startScenario = useCallback(() => {
    if (currentScenario) {
      const botMessage = { sender: 'bot', text: currentScenario.botText };
      setMessages([botMessage]); // Initialize the scenario with the first message
      setChoices(currentScenario.options); // Show initial options for this scenario
      setShowNextButton(false); // Hide the "Next" button when a new scenario starts
      setInputDisabled(false); // Enable input when a new scenario starts
    }
  }, [currentScenario]);

  useEffect(() => {
    if (messages.length === 0 && currentScenario) {
      startScenario(); // Initiate the first scenario
    }
  }, [messages, startScenario, currentScenario]);

  const handleUserInput = () => {
    setInputDisabled(true); // Disable input field
    const userInput = input.trim().toLowerCase();
    const selectedChoice = choices.find(choice => choice.label === userInput);

    if (selectedChoice) {
      const userMessage = { sender: 'user', text: selectedChoice.text };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const botMessage = { sender: 'bot', text: selectedChoice.response };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setIsTyping(false);
        setChoices([]); // Hide the choices after bot responds
        setShowNextButton(true); // Show the "Next" button after a response
        setInput("Click Next"); // Set placeholder to "Click Next"
      }, 1500); // Delay bot response
    }

    setInput(""); // Clear input
  };

  const handleNextClick = () => {
    setScenarioIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < scenarios.length) {
        setMessages([]); // Clear messages for the next scenario
        setChoices([]);  // Clear choices for the next scenario
        setInput(""); // Clear input field
        setInputDisabled(false); // Enable input for new scenario
        return nextIndex; // Move to the next scenario
      }
      return prevIndex;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  };

  useEffect(() => {
    if (messages.length === 0 && currentScenario) {
      startScenario();
    }
  }, [messages, startScenario, currentScenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Extract the first word of the preface to use as the contact name
  const contactName = currentScenario ? currentScenario.preface.split(" ")[0] : "Friend";


  return (
    <body>
      <div className="container">
        {/* Scenario Sidebar */}
        <div className="sidebar">
          <h3>Scenario</h3>
          <p id="scenario-preface">
            {currentScenario ? currentScenario.preface : "Loading scenario..."}
          </p>
          {showNextButton && (
            <button className="next-button" onClick={handleNextClick}>
              Next
            </button>
          )}
        </div>
        
        {/* Phone Container */}
        <div className="app-container">
          <div className="phone-top"></div>
          <div className="phone-front-camera"></div>
          <div className="phone-speaker"></div>
  
          <div className="chat-window">
            <div className="contact-bar">
              <img src="https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=" alt="Contact" />
              <div className="contact-name">{contactName}</div> {/* Display dynamic contact name */}
            </div>
  
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
  
              {isTyping && (
                <div className="message bot typing-indicator">
                  <span>Typing...</span>
                </div>
              )}
  
              <div ref={messagesEndRef} /> {/* Empty div for scrolling */}
            </div>
  
            <div className="input-area">
              <input
                type="text"
                placeholder={inputDisabled ? "Click Next" : "Enter a letter (a, b, c...)"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={inputDisabled} // Disable input based on state
              />
              <button onClick={handleUserInput} disabled={inputDisabled}>
                Send
              </button>
            </div>
            
          </div>
          <div className="phone-bottom"></div>
        </div>
  
        {/* Choices Box */}
        <div className="choices-area">
          {choices.length > 0 && !inputDisabled && (
            <div className="choice-prompt">
              {choices.map((choice, index) => (
                <div key={index} className="choice-option">
                  {choice.label}: {choice.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </body>
  );
}
 export default App;  