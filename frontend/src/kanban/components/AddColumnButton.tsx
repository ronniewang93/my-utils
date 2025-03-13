import React from 'react';

interface AddColumnButtonProps {
  onClick: () => void;
}

const AddColumnButton: React.FC<AddColumnButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="add-col-btn" aria-label="添加新列">
      +
    </button>
  );
};

export default AddColumnButton; 