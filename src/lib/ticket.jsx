// src/lib/ticketUtils.js (or similar)
import { FileText, Building, Wrench, ArrowUp, ArrowDown } from "lucide-react";

// Helper to get a relevant title from any ticket type
export const getTicketTitle = (ticket) => {
  switch (ticket.type) {
    case "Work Order":
      return ticket.jobNumber || "Work Order";
    case "Customer":
      return ticket.customerName || "Customer Profile";
    case "Service Ticket":
      return ticket.jobName || "Service Ticket";
    case "Above Ground":
    case "Under Ground":
      return ticket.propertyDetails?.propertyName || "Test Report";
    default:
      return "Activity";
  }
};

// Helper to get a unique icon for each ticket type
export const getTicketIcon = (ticketType) => {
  switch (ticketType) {
    case "Work Order":
      return <Wrench className="h-5 w-5 text-gray-500" />;
    case "Customer":
      return <Building className="h-5 w-5 text-gray-500" />;
    case "Service Ticket":
      return <FileText className="h-5 w-5 text-gray-500" />;
    case "Above Ground":
      return <ArrowUp className="h-5 w-5 text-gray-500" />;
    case "Under Ground":
      return <ArrowDown className="h-5 w-5 text-gray-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

// Helper to get a different color for each badge
export const getBadgeVariant = (ticketType) => {
  switch (ticketType) {
    case "Work Order":
      return "default";
    case "Customer":
      return "secondary";
    case "Service Ticket":
      return "outline";
    case "Above Ground":
    case "Under Ground":
      return "destructive";
    default:
      return "secondary";
  }
};

// Helper to construct the correct navigation URL
export const getTicketUrl = (ticket) => {
  switch (ticket.type) {
    case "Work Order":
      return `/work-order/${ticket._id}`;
    case "Alarm":
      return `/alarm/${ticket._id}`;
    case "Customer":
      return `/customer/${ticket._id}`;
    case "Service Ticket":
      return `/service-ticket/${ticket._id}`;
    case "Above Ground":
      return `/above-ground/${ticket._id}`;
    case "Under Ground":
      return `/under-ground/${ticket._id}`;
    default:
      return "/";
  }
};
