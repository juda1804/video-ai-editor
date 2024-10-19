import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

interface AditionalResourcesProps {
  addTikTokLink: (link: string) => void;
}

const AditionalResources: React.FC<AditionalResourcesProps> = ({ addTikTokLink }) => {
  const [links, setLinks] = useState<string[]>(['']);

  const handleAddLink = (index: number) => {
    if (links[index]) {
      addTikTokLink(links[index]);
      setLinks([...links, '']); // Add a new empty input field
    }
  };

  const handleChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {links.map((link, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label={`TikTok Video Link ${index + 1}`}
            variant="outlined"
            value={link}
            onChange={(e) => handleChange(index, e.target.value)}
            sx={{ mr: 2, flexGrow: 1 }}
          />
          <Button variant="contained" onClick={() => handleAddLink(index)}>
            Add
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default AditionalResources;