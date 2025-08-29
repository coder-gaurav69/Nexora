import { useState } from 'react';
import AddressCard from './AddressCard';
import AddressModal from './AddressModal';

const AddressSection = () => {
  const [addresses, setAddresses] = useState<any[]>([
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      addressLine1: '123 Main Street, Apt 4B',
      addressLine2: 'New York, NY 10001',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Work',
      name: 'John Doe',
      addressLine1: '456 Business Ave, Suite 200',
      addressLine2: 'New York, NY 10002',
      isDefault: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState<any>(null);

  const handleSave = (data: any) => {
    if (editAddress) {
      setAddresses(prev =>
        prev.map(addr => (addr.id === editAddress.id ? { ...addr, ...data } : addr))
      );
      setEditAddress(null);
    } else {
      setAddresses(prev => [...prev, { ...data, id: Date.now(), isDefault: false }]);
    }
  };

  const handleDelete = (id: number) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: number) => {
    setAddresses(prev =>
      prev.map(addr => ({ ...addr, isDefault: addr.id === id }))
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Addresses</h1>
          <p className="text-gray-600">Manage your shipping and billing addresses.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-black text-white px-4 py-2 rounded flex items-center gap-2">
          <span>＋</span> Add Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map(address => (
          <AddressCard
            key={address.id}
            type={address.type}
            name={address.name}
            addressLine1={address.addressLine1}
            addressLine2={address.addressLine2}
            isDefault={address.isDefault}
            onEdit={() => {
              setEditAddress(address);
              setShowModal(true);
            }}
            onDelete={() => handleDelete(address.id)}
            onSetDefault={() => handleSetDefault(address.id)}
          />
        ))}
      </div>

      <AddressModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditAddress(null);
        }}
        onSave={handleSave}
        defaultData={editAddress}
      />
    </div>
  );
};

export default AddressSection;
