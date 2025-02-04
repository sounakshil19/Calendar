import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    start: "",
    end: "",
    image: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleEventSave = () => {
    if (!formData.name || !formData.start || !formData.end) {
      alert("All fields are required.");
      return;
    }

    if (formData.id) {
    
      setEvents(
        events.map((event) =>
          event.id === formData.id
            ? { ...event, name: formData.name, start: formData.start, end: formData.end, image: formData.image }
            : event
        )
      );
    } else {
    
      setEvents([
        ...events,
        { ...formData, id: Date.now().toString(), image: formData.image },
      ]);
    }

    
    setFormData({ id: "", name: "", start: "", end: "", image: null });
    setIsDialogOpen(false);
  };

  
  const handleEventDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  
  const handleEventClick = (info) => {
    const event = events.find((event) => event.id === info.event.id);
    setFormData({ ...event });
    setIsDialogOpen(true);
  };

  
  const handleDialogOpen = () => {
    setFormData({ id: "", name: "", start: "", end: "", image: null });
    setIsDialogOpen(true);
  };

  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData({ id: "", name: "", start: "", end: "", image: null });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <button
        onClick={handleDialogOpen}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Add Event
      </button>

      {isDialogOpen && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>
            {formData.id ? "Edit Event" : "Add Event"}
          </h3>
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={formData.name}
            onChange={handleInputChange}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="datetime-local"
            name="start"
            value={formData.start}
            onChange={handleInputChange}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="datetime-local"
            name="end"
            value={formData.end}
            onChange={handleInputChange}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            style={{
              display: "block",
              marginBottom: "10px",
            }}
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              style={{
                width: "10%",
                height: "auto",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            />
          )}
          <button
            onClick={handleEventSave}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Save
          </button>
          <button
            onClick={handleDialogClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          id: event.id,
          title: event.name,
          start: event.start,
          end: event.end,
        }))}
        eventClick={handleEventClick} 
        eventRemove={(info) => handleEventDelete(info.event.id)} 
        height="auto"
        style={{
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
};

export default Calendar;
