import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [isAdminView, setIsAdminView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(" LocalStorage user:", storedUser);
    if (!storedUser || !storedUser.email) {
      console.warn(" No user found in localStorage. Redirecting to login.");
      navigate("/");
      return;
    }

    const fetchTickets = async () => {
      try {
        const ticketRes = await axios.get("http://localhost:5000/freshdesks/tickets");
        const allFetched = ticketRes.data;
        setAllTickets(allFetched);
        console.log("✅ All tickets fetched:", allFetched);

        // Get Freshdesk contact by email
        const contactRes = await axios.get(`http://localhost:5000/freshdesks/contacts?email=${storedUser.email}`);
        const contactData = contactRes.data;
        console.log("✅ Freshdesk contact for email:", storedUser.email, contactData);

        const contactId = contactData.id;

        const userTickets = allFetched.filter(ticket => String(ticket.requester_id) === String(contactId));
        console.log("🎯 Filtered tickets for user:", userTickets);

        setTickets(userTickets);
      } catch (err) {
        console.error("❌ Error fetching tickets or contact", err);
      }
    };

    fetchTickets();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAdminToggle = () => {
    setIsAdminView(!isAdminView);
    setTickets(!isAdminView ? allTickets : []);
  };

  const getStatusLabel = (statusCode) => {
    const statusMap = {
      2: "Open",
      3: "Pending",
      4: "Resolved",
      5: "Closed",
      6: "Waiting on Customer",
      7: "Waiting on Third Party",
    };
    return statusMap[statusCode] || "Unknown";
  };

  const getStatusColor = (statusCode) => {
    const colorMap = {
      2: "bg-blue-100 text-blue-700",
      3: "bg-yellow-100 text-yellow-800",
      4: "bg-green-100 text-green-700",
      5: "bg-gray-100 text-gray-600",
      6: "bg-orange-100 text-orange-700",
      7: "bg-purple-100 text-purple-700",
    };
    return colorMap[statusCode] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">🎫 Ticket Dashboard</h2>
        <div className="space-x-4">
          <button
            onClick={handleAdminToggle}
            className={`px-4 py-2 rounded-xl ${isAdminView ? "bg-gray-600" : "bg-green-600"} text-white hover:opacity-90 transition font-semibold`}
          >
            {isAdminView ? "👤 My Tickets" : "🛠️ Admin: All Tickets"}
          </button>
          <Link
            to="/logs"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold shadow-sm"
          >
            🔍 Webhook Logs
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-semibold shadow-sm"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {tickets.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition"
            >
              <Link to={`/ticket/${ticket.id}`} className="block p-5 space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">{ticket.subject}</h3>
                <p className="text-sm text-gray-500">Ticket ID: #{ticket.id}</p>
                <span
                  className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor(ticket.status)}`}
                >
                  {getStatusLabel(ticket.status)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center mt-20">No tickets found. 🚫</p>
      )}
    </div>
  );
}

export default TicketList;
