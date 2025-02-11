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
  const [viewMode, setViewMode] = useState("calendar");

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
      setEvents([...events, { ...formData, id: Date.now().toString() }]);
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
      <button onClick={() => setViewMode(viewMode === "calendar" ? "list" : "calendar")} style={{
        padding: "10px 20px",
        backgroundColor: "#6c757d",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "10px"
      }}>
        Switch to {viewMode === "calendar" ? "List Mode" : "Calendar Mode"}
      </button>
      <button onClick={handleDialogOpen} style={{
        padding: "10px 20px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "20px"
      }}>
        Add Event
      </button>

      {isDialogOpen && (
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <h3>{formData.id ? "Edit Event" : "Add Event"}</h3>
          <input type="text" name="name" placeholder="Event Name" value={formData.name} onChange={handleInputChange} style={{ display: "block", width: "100%", padding: "10px", marginBottom: "10px" }} />
          <input type="datetime-local" name="start" value={formData.start} onChange={handleInputChange} style={{ display: "block", width: "100%", padding: "10px", marginBottom: "10px" }} />
          <input type="datetime-local" name="end" value={formData.end} onChange={handleInputChange} style={{ display: "block", width: "100%", padding: "10px", marginBottom: "15px" }} />
          <input type="file" name="image" onChange={handleImageChange} style={{ display: "block", marginBottom: "10px" }} />
          {formData.image && <img src={formData.image} alt="Preview" style={{ width: "10%", height: "auto", marginBottom: "15px" }} />}
          <button onClick={handleEventSave} style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}>Save</button>
          <button onClick={handleDialogClose} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cancel</button>
        </div>
      )}

      {viewMode === "calendar" ? (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events.map((event) => ({ id: event.id, title: event.name, start: event.start, end: event.end }))}
          eventClick={handleEventClick}
          height="auto"
        />
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {events.map((event) => (
            <li key={event.id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
              <strong>{event.name}</strong> - {event.start} to {event.end}
              {event.image && <img src={event.image} alt="Event" style={{ display: "block", width: "50px", height: "50px", marginTop: "5px" }} />}
              <button onClick={() => handleEventDelete(event.id)} style={{ marginLeft: "10px", color: "red", border: "none", cursor: "pointer" }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Calendar;
