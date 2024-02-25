import React from 'react';
import '../css/Venue.css'; // CSS for styling

const venues = [
  { id: 1, name: 'First floor', rooms: ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105'] },
  { id: 2, name: 'Second floor', rooms: ['Room 201', 'Room 202','Room 203','Room 204','Room 205','Room 206'] },
  { id: 2, name: 'Third floor', rooms: ['Room 301', 'Room 302','Room 303','Room 304','Room 305','Room 306'] },
  { id: 2, name: 'Fourth floor', rooms: ['Room 401', 'Room 402','Room 403','Room 404','Room 405','Room 406'] },
];

const venueAvailability = [
  { venueId: 1, roomId: 'Room 101', available: true },
  { venueId: 1, roomId: 'Room 102', available: false },
  { venueId: 1, roomId: 'Room 103', available: true },
  { venueId: 1, roomId: 'Room 104', available: true },
  { venueId: 1, roomId: 'Room 105', available: true },

  { venueId: 2, roomId: 'Room 201', available: true },
  { venueId: 2, roomId: 'Room 202', available: false },
  { venueId: 2, roomId: 'Room 203', available: false },
  { venueId: 2, roomId: 'Room 204', available: false },
  { venueId: 2, roomId: 'Room 205', available: true },
  { venueId: 2, roomId: 'Room 206', available: false },

  { venueId: 2, roomId: 'Room 301', available: false },
  { venueId: 2, roomId: 'Room 302', available: false },
  { venueId: 2, roomId: 'Room 303', available: false },
  { venueId: 2, roomId: 'Room 304', available: true },
  { venueId: 2, roomId: 'Room 305', available: true },
  { venueId: 2, roomId: 'Room 306', available: false },

  { venueId: 2, roomId: 'Room 401', available: true },
  { venueId: 2, roomId: 'Room 402', available: false },
  { venueId: 2, roomId: 'Room 403', available: true },
  { venueId: 2, roomId: 'Room 404', available: true },
  { venueId: 2, roomId: 'Room 405', available: true },
  { venueId: 2, roomId: 'Room 406', available: false },
];

function VenueAvailability() {
  return (
    <div className="venue-gri mt-10 w-4/6 ml-[25rem]">
      {venues.map((venue) => (
        <div key={venue.id} className="venue mt-10 ">
          <h3 className='text-left text-xl'>{venue.name}</h3>
          <div className="room-grid h-12">
            {venue.rooms.map((room) => {
              const availability = venueAvailability.find((v) => v.roomId === room && v.venueId === venue.id);
              return (
                <div key={room} className={`room rounded-md pt-2 ${availability.available ? 'available' : 'occupied'}`}>
                  {room}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VenueAvailability;
