import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AppointmentList from './AppointmentList';
import { Tables } from '../lib/db/utils';

type Appointment = Tables['appointments']['Row'];

interface AppointmentSearchProps {
  appointments: Appointment[];
}

const AppointmentSearch: React.FC<AppointmentSearchProps> = ({ appointments }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = appointments.filter(appointment => {
    if (!searchTerm) return false;
    
    const search = searchTerm.toLowerCase();
    
    // search across name, email, phone, and notes
    return (
      appointment.name.toLowerCase().includes(search) ||
      appointment.email.toLowerCase().includes(search) ||
      appointment.phone.includes(search) ||
      (appointment.notes && appointment.notes.toLowerCase().includes(search))
    );
  });

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-6 h-6" />
          Search Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search appointments by name, email, phone, and notes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {searchTerm && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-3">Search Results</h3>
              <AppointmentList 
                appointments={filteredAppointments}
                emptyMessage="No appointments found matching your search criteria"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentSearch;