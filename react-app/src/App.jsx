import { useEffect, useState } from 'react'
import './App.css'
import {  socket } from './socket'
import { Box, Button, Flex, Input } from '@chakra-ui/react';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState('');
  const [data, setData] = useState([]);
  const [room, setRoom] = useState("");

  useEffect(() => {
    function onConnect(){
      setIsConnected(true);
    }

    function onDisconnect(){
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // return () => {
    //   socket.off('connect', onConnect);
    //   socket.off('disconnect', onDisconnect);
    // };
  }, [])

  useEffect(() => {
    socket.on('recieve-message', (msg) => {
      setData([...data, msg]);
    })
  }, [socket])

  const handleMessage = (e) => {
    setMessage(e.target.value);
  }



  const joinRoom = () => {
    if(room !== ""){
      socket.emit('join-room', room);
      console.log('joined room', room);
    }
  }

    const sendMessage = () => {
      setData([...data, message]);
      socket.emit('create-message', message, room);
      setMessage('');
    }

  const handleRoom = (e) => {
    setRoom(+e.target.value);
  }

  return (
    <>
      <Box w="100%" bg="gray.400" h="100vh"
        display="flex" 
        alignItems={'center'}
        flexDir={'column'}
      >
        <Flex gap={2} w="50%" mt={20} mb={10}>
          <Input type="number" variant="filled" onChange={handleRoom} value={room}
            placeholder='Enter room'
          />
          <Button colorScheme="messenger"
            onClick={ joinRoom}
          >Enter</Button>
        </Flex>
        <Flex gap={2} w="50%" mt={20} mb={10}>
          <Input type="text" variant="filled" onChange={handleMessage} value={message}
            placeholder='Send Message...'
          />
          <Button colorScheme="messenger"
            onClick={ sendMessage}
          >Send</Button>
        </Flex>

        <ul>
          { data.map((msg, i) => {
            return <li id={i}>{msg}</li>
          })}
        </ul>
      </Box>
    </>
  )
}

export default App
