// src/components/TicketDetails.js
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/freshdesks/tickets`)
      .then(res => {
        const found = res.data.find(t => t.id === parseInt(id));
        setTicket(found);

       if (found?.requester_id) {
  axios.get(`http://localhost:5000/freshdesks/contacts/${found.requester_id}`)
    .then(res => {
      const email = res.data.email;
      console.log("Fetched requester email:", email);

      axios.get(`http://localhost:5000/hubspot/contact?email=${email}`)
        .then(r => setContact(r.data))
        .catch(() => console.log("No HubSpot contact"));
    })
    .catch(() => console.log("Failed to get requester email"));
}

      });

    axios.get(`http://localhost:5000/freshdesks/ticket/${id}/conversations`)
      .then(res => setConversations(res.data))
      .catch(() => console.log("No conversation"));
  }, [id]);

  const getStatusLabel = (statusCode) => {
    const statusMap = {
      2: "Open",
      3: "Pending",
      4: "Resolved",
      5: "Closed",
      6: "Waiting on Customer",
      7: "Waiting on Third Party"
    };
    return statusMap[statusCode] || "Unknown";
  };

  const getStatusColor = (statusCode) => {
    const colorMap = {
      2: "bg-blue-100 text-blue-700",
      3: "bg-yellow-100 text-yellow-700",
      4: "bg-green-100 text-green-700",
      5: "bg-gray-200 text-gray-600",
      6: "bg-orange-100 text-orange-700",
      7: "bg-purple-100 text-purple-700"
    };
    return colorMap[statusCode] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🎟️ Ticket #{id}</h2>

      {ticket ? (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mb-6">
          <p className="text-lg font-semibold text-gray-700 mb-2">Subject: {ticket.subject}</p>
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(ticket.status)}`}>
            {getStatusLabel(ticket.status)}
          </span>
        </div>
      ) : (
        <p className="text-gray-500">Loading ticket...</p>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">🗣 Conversations</h3>
        {conversations.length > 0 ? (
          <ul className="space-y-3">
            {conversations.map((c, i) => (
              <li key={i} className="bg-gray-50 border border-gray-200 p-4 rounded-md text-gray-700">
                {c.body_text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No conversations found.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">🧠 HubSpot Contact</h3>
        {contact ? (
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 space-y-1">
            <p><strong>Name:</strong> {contact.properties.firstname} {contact.properties.lastname}</p>
            <p><strong>Email:</strong> {contact.properties.email}</p>
            <p><strong>Phone:</strong> {contact.properties.phone || "N/A"}</p>
            <p><strong>Stage:</strong> {contact.properties.lifecyclestage}</p>
          </div>
        ) : (
          <p className="text-gray-500">No matching contact found.</p>
        )}
      </div>
    </div>
  );
}

export default TicketDetails;
