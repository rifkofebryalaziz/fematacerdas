// API functions for backend integration

export async function sendChatMessage(message: string, files?: File[]) {
  // Replace with your actual API endpoint
  const formData = new FormData();
  formData.append('message', message);
  
  if (files) {
    files.forEach((file) => {
      formData.append('files', file);
    });
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}

export async function getChatHistory(chatId: number) {
  const response = await fetch(`/api/chats/${chatId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }

  return response.json();
}

export async function getNearbyPlaces(
  latitude: number,
  longitude: number,
  radius: number,
  type?: string
) {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
    radius: radius.toString(),
    ...(type && { type }),
  });

  const response = await fetch(`/api/places?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch nearby places');
  }

  return response.json();
}

export async function updateUserProfile(userId: string, data: any) {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return response.json();
}

export async function updateSettings(userId: string, settings: any) {
  const response = await fetch(`/api/users/${userId}/settings`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error('Failed to update settings');
  }

  return response.json();
}