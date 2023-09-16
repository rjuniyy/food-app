import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, View, Text, Box, Button } from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat';
import { supabase } from '../../src/services/supabase';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import AddRound from '../../assets/icons/add-round.svg';

export default function AdminDetailChatScreen({ route }) {
  const userData = route.params?.userData;
  const { session } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error.message);
          return;
        }

        const filteredMessages = messages.filter(
          (message) =>
            message.sender_id === userData.user_id ||
            message.receiver_id === userData.user_id,
        );

        setMessages(formatMessages(filteredMessages));
      } catch (error) {
        console.error('Error fetching messages:', error.message);
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new;
          setMessages((previousMessages) => {
            const updatedMessages = [
              ...previousMessages,
              formatMessages([newMessage])[0],
            ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            return updatedMessages;
          });
        },
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatMessages = (messages) => {
    return messages.map((message) => ({
      _id: message.id,
      text: message.text,
      createdAt: new Date(message.created_at),
      user: {
        _id: message.sender_id,
        name: message.full_name,
      },
      image: message.image, // Include the image property in the message object
    }));
  };

  const onSend = async (newMessages = []) => {
    try {
      const { data, error } = await supabase.from('messages').insert([
        {
          sender_id: session.user.id,
          receiver_id: userData.user_id,
          text: newMessages[0].text,
          full_name: session.user.user_metadata.full_name,
          image: newMessages[0].image || null, // Save the image URL to the "image" column in your Supabase table
        },
      ]);
      if (error) {
        console.error(error);
        return;
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const uploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access media library denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const { base64 } = result;
      const base64FileData = decode(base64);

      try {
        const response = await supabase.storage
          .from('images')
          .upload(`chat-${Date.now()}.png`, base64FileData, {
            contentType: 'image/png',
            cacheControl: '3600',
            upsert: false,
          });

        if (response.error) {
          console.log('Error uploading image:', response.error.message);
          return;
        }

        const imageUrlResponse = await supabase.storage
          .from('images')
          .getPublicUrl(response.data.path);

        if (imageUrlResponse.error) {
          console.log(
            'Error retrieving public URL:',
            imageUrlResponse.error.message,
          );
          return;
        }

        const imageUrl = imageUrlResponse.data.publicUrl;

        const { data, error } = await supabase.from('messages').insert([
          {
            sender_id: session.user.id,
            receiver_id: userData.user_id,
            text: '',
            full_name: session.user.email,
            image: imageUrl, // Save the image URL to the "image" column in your Supabase table
          },
        ]);
        if (error) {
          console.error(error);
          return;
        }
      } catch (error) {
        console.log('Error uploading image:', error.message);
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await supabase.from('messages').delete().eq('_id', messageId);
      setMessages((previousMessages) =>
        previousMessages.filter((message) => message._id !== messageId),
      );
    } catch (error) {
      console.error('Error deleting message:', error.message);
    }
  };

  const renderCustomActions = () => {
    return (
      <Button
        onPress={uploadImage}
        bg="blue.500"
        size={12}
        alignSelf="center"
        colorScheme="light"
      >
        <AddRound />
      </Button>
    );
  };

  return (
    <NativeBaseProvider>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: session.user.id,
          name: session.user.user_metadata.full_name,
        }}
        renderActions={renderCustomActions}
        inverted={false}
      />
    </NativeBaseProvider>
  );
}
