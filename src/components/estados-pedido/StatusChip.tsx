import React from 'react';
import { Chip } from '@mui/material';
import { getStatusBgColor, getStatusFontColor } from '../../utils/statusStyles';


interface StatusChipProps {
  status: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  return (
    <Chip
      label={status}
      style={{
        backgroundColor: getStatusBgColor(status),
        color: getStatusFontColor(status),
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}
    />
  );
};

export default StatusChip;
