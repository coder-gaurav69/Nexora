import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  defaultData?: any;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, onSave, defaultData }) => {
  const [form, setForm] = useState({
    type: '',
    name: '',
    addressLine1: '',
    addressLine2: '',
  });

  useEffect(() => {
    if (defaultData) {
      setForm(defaultData);
    }
  }, [defaultData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="font-bold text-xl mb-4">{defaultData ? 'Edit' : 'Add'} Address</h2>
        <input className="border p-2 mb-3 w-full" name="type" placeholder="Type (Home, Work...)" value={form.type} onChange={handleChange} />
        <input className="border p-2 mb-3 w-full" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input className="border p-2 mb-3 w-full" name="addressLine1" placeholder="Address Line 1" value={form.addressLine1} onChange={handleChange} />
        <input className="border p-2 mb-3 w-full" name="addressLine2" placeholder="Address Line 2" value={form.addressLine2} onChange={handleChange} />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-black text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
