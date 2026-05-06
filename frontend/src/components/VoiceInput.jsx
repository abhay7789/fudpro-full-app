import React, { useState } from 'react';
import { TextInput, ActionIcon, Tooltip } from '@mantine/core';
import { Microphone, MicrophoneOff } from 'tabler-icons-react';
import { notifications } from '@mantine/notifications';

const VoiceInput = ({ label, placeholder, value, onChange, required, ...props }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      notifications.show({
        title: 'Not Supported',
        message: 'Voice-to-text is not supported in this browser.',
        color: 'red',
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // If the field is numeric (price), try to parse it
      if (props.type === 'number') {
        const numericValue = transcript.replace(/[^0-9.]/g, '');
        onChange(numericValue);
      } else {
        onChange(transcript);
      }
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      notifications.show({
        title: 'Error',
        message: 'Could not recognize speech. Please try again.',
        color: 'red',
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      rightSection={
        <Tooltip label={isListening ? "Listening..." : "Click to speak"}>
          <ActionIcon 
            color={isListening ? "red" : "orange"} 
            variant={isListening ? "filled" : "light"}
            onClick={startListening}
            radius="md"
          >
            {isListening ? <MicrophoneOff size={18} /> : <Microphone size={18} />}
          </ActionIcon>
        </Tooltip>
      }
      {...props}
    />
  );
};

export default VoiceInput;
