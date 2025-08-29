import React from 'react';

interface AddressProps {
  type: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  isDefault?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

const AddressCard: React.FC<AddressProps> = ({ type, name, addressLine1, addressLine2, isDefault, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className="border p-6 rounded-md bg-white relative">
      <h3 className="font-bold text-lg">{type}</h3>
      <p className="font-semibold">{name}</p>
      <p className="text-gray-600">{addressLine1}</p>
      <p className="text-gray-600">{addressLine2}</p>

      {isDefault ? (
        <span className="absolute top-4 right-4 text-xs bg-gray-200 px-2 py-1 rounded-full">Default</span>
      ) : (
        <button onClick={onSetDefault} className="absolute top-4 right-4 text-xs text-blue-600 hover:underline">
          Set as default
        </button>
      )}

      <div className="flex gap-2 mt-4">
        <button onClick={onEdit} className="border rounded px-4 py-2 hover:bg-gray-50">Edit</button>
        <button onClick={onDelete} className="border rounded px-4 py-2 hover:bg-gray-50">Delete</button>
      </div>
    </div>
  );
};

export default AddressCard;
