import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AppointmentForm from './AppointmentForm';
import AppointmentSearch from './AppointmentSearch';
import AppointmentList from './AppointmentList';
import { insertData, fetchData } from '../lib/db/utils';
import { Tables } from '../lib/db/utils';

type Appointment = Tables['appointments']['Row'];
type NewAppointment = Tables['appointments']['Insert'];

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
}

const AppointmentScheduler = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  // fetch appointments from Supabase on component mount
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchData('appointments');
        // console.log(data);
        setAppointments(data);
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Generate available time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // phone number formatting
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      
      let formattedPhone = '';
      if (digitsOnly.length <= 3) {
        formattedPhone = digitsOnly;
      } else if (digitsOnly.length <= 6) {
        formattedPhone = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
      } else {
        formattedPhone = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // combine date and time into a timestamp with timezone
      const appointmentTime = new Date(`${formData.date}T${formData.time}:00`).toISOString();
      
      const newAppointment: NewAppointment = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        appointment_time: appointmentTime,
        notes: formData.notes || null
      };

      const insertedAppointment = await insertData('appointments', newAppointment);
      
      setAppointments(prev => [...prev, insertedAppointment]);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        notes: ''
      });
      
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to save appointment. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <AppointmentForm 
        formData={formData}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        timeSlots={timeSlots}
      />
      
      <AppointmentSearch appointments={appointments} />

      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading appointments...</div>
          ) : (
            <AppointmentList appointments={appointments} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentScheduler;