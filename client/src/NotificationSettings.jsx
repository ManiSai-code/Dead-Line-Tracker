import React, { useState} from 'react';
import axios from 'axios';

const NotificationSettings = ({ userId }) => {
    const [whatsappOn, setWhatsappOn] = useState(true);

    const toggleWhatsApp = async () => {
        try {
            const newValue = !whatsappOn;
            // This sends the update to your Backend
            await axios.put(`/api/users/${userId}/notifications/whatsapp`, {
                enabled: newValue
            });
            setWhatsappOn(newValue);
            alert(`WhatsApp notifications turned ${newValue ? 'ON' : 'OFF'}`);
        } catch (error) {
            console.error("Error updating preferences", error);
        }
    };

    return (
        <div className="flex items-center gap-4 p-4 border rounded">
            <label className="font-bold">WhatsApp Alerts:</label>
            <button 
                onClick={toggleWhatsApp}
                style={{
                    backgroundColor: whatsappOn ? '#25D366' : '#ccc',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                {whatsappOn ? "ENABLED" : "DISABLED"}
            </button>
        </div>
    );
};

export default NotificationSettings;