export const uploadAndCombineVideos = async (formData: FormData): Promise<string> => {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir los videos.');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };